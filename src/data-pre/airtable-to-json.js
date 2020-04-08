const slugify = require('slugify')
const escapeStringRegexp = require("escape-string-regexp")
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
const Airtable = require('airtable')
const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE)

var recordFieldsJSON = []
var count = 0

base('Testing Locations').select({
    maxRecords: 9999,
    view: "Verified Locations",
    sort: [{field: "State", direction: "asc"}]
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    //console.log(JSON.stringify(records, null, 2))
    records.forEach(function(record) {
      recordFieldsJSON.push(record.fields)
      generatePost(record.fields)
    })

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    // console.log(JSON.stringify(recordFieldsJSON, null, 2))
    try {
        if (fs.existsSync(__dirname + '/locations.json')) {
            const minuteAgo = new Date( Date.now() - 1000 * 60)
            const fileDate = fs.statSync(__dirname + '/locations.json').mtime
            if (minuteAgo.getTime() > fileDate.getTime()) {
                console.log('Writing locations.json')
                fs.writeFileSync(__dirname + '/locations.json', JSON.stringify(recordFieldsJSON, null, 2))
            } else {
                console.log('Skipping re-write of locations.json because it is less than one minute old.')
            }
        } else {
            console.log('Writing locations.json')
            fs.writeFileSync(__dirname + '/locations.json', JSON.stringify(recordFieldsJSON, null, 2))
        }
    } catch (err) {
        console.error(err)
    }
}, function done(err) {
    if (err) { console.error(err); return; }
})

// If you only want the first page of records, you can
// use `firstPage` instead of `eachPage`.
base('Testing Locations').select({
    view: 'Verified Locations'
}).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    // records.forEach(function(record) {
    //     console.log('Retrieved', record.get('Name'));
    // });
})

function generatePost(location) {
    count += 1
    let fileString = `---
layout: base
permalink: "locations/${betterSlug(location.State)}/${betterSlug(location.City)}/${betterSlug(location.Name)}/"
tags: locations
title: ${location.Name}
state: ${location.State}
hood: ${location.Neighborhood ? location.Neighborhood : location.City}
address: ${location.Address}
city: ${location.City}
zip: ${location.Zip}
locationType: ${location.LocationType}
phone: ${location.Phone}
---
## ${location.State}`

  try {
    console.log(`${count} Generating ${location.Name}`)
    fs.writeFileSync(process.cwd() + `/src/locations/location-${count}.md`, fileString)
  } catch (err) {
    console.error(err)
  }
}

function betterSlug(input, options = {}) {
  const removals = "<>.~\":/?#[]{}()@!$'()*+,;="
  // Extend default configuration
  options = {
    ...{
      extensions: {},
      removals: removals
    },
    ...options
  }

  if (options.extensions) {
    slugify.extend(options.extensions);
  }

  return slugify(input, {
    replacement: "-",
    remove: new RegExp("[" + escapeStringRegexp(options.removals) + "]", "g"),
    lower: true
  })
}