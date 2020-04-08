const slugify = require('slugify')
const escapeStringRegexp = require("escape-string-regexp")
const equals = require('shallow-equals')
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
    let hours = ""
    count += 1
    // TODO: check for 24 hours here first
    if (location.DaysOfWeek) {
      hours = location.DaysOfWeek
    } else {
      hours = "Unknown hours of operation"
    }

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
hours: ${hours}
phone: ${location.Phone}
website: ${location.Website}
onlineBooking: ${location.OnlineBooking}
closed: ${location.Closed}
notes: ${location.Notes}
notesOther: ${location.NotesOther}
daysOfWeek: ${location.DaysOfWeek}
opensAt: ${location.OpensAt}
closesAt: ${location.ClosesAt}
altDaysOfWeek: ${location.AltDaysOfWeek}
altOpensAt: ${location.AltOpensAt}
altClosesAt: ${location.AltClosesAt}
alt2DaysOfWeek: ${location.Alt2DaysOfWeek}
alt2OpensAt: ${location.Alt2OpensAt}
alt2ClosesAt: ${location.Alt2ClosesAt}
---
## ${location.Name}`

  try {
    console.log(`${count} Generating ${location.Name}`)
    fs.writeFileSync(process.cwd() + `/src/locations/location-${count}.md`, fileString)
  } catch (err) {
    console.error(err)
  }
}

function rangeDaysOfWeek(arr) {
  let range = ""
  let days = arr.sort()
  let all = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()
  let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].sort()
  let weekends = ["Sunday", "Saturday"].sort()
  let sunday = ["Sunday"]
  let monday = ["Monday"]
  let tuesday = ["Tuesday"]
  let wednesday = ["Wednesday"]
  let thursday = ["Thursday"]
  let friday = ["Friday"]
  let saturday = ["Saturday"]
  let mwf = ["Monday", "Wednesday","Friday"].sort()
  let tt = ["Tuesday","Thursday"].sort()
  let all = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()

  if (equals(days, all)) {
    let range = "Everyday"
  } else if (equals(days, weekdays)) {
    let range = "Weekdays"
  } else if (equals(days, weekends)) {
    let range = "Weekends"
  } else if (equals(days, sunday)) {
    let range = "Sundays"
  } else if (equals(days, monday)) {
    let range = "Mondays"
  } else if (equals(days, tuesday)) {
    let range = "Tuesdays"
  } else if (equals(days, wednesday)) {
    let range = "Wednesdays"
  } else if (equals(days, thursday)) {
    let range = "Thursdays"
  } else if (equals(days, friday)) {
    let range = "Fridays"
  } else if (equals(days, saturday)) {
    let range = "Saturdays"
  } else if (equals(days, mwf)) {
    let range = "M, W, F"
  } else if (equals(days, tt)) {
    let range = "Tu, Th"
  } else {
    let range = "ERROR"
  }
  // TODOD: add remaining combos
  return range
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