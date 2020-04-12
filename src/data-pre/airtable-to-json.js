const slugify = require('slugify')
const escapeStringRegexp = require("escape-string-regexp")
const equals = require('shallow-equals')
const statesTable = require('datasets-us-states-names-abbr')
const moment = require('moment')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
const Airtable = require('airtable')
const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE)
const dayCombos = require('./day-combos')

var recordFieldsJSON = []
var count = 0

base('Testing Locations').select({
  maxRecords: 9999,
  view: "Verified Locations",
  sort: [{field: "State", direction: "asc"}]
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  records.forEach(function(record) {
    recordFieldsJSON.push(record.fields)
    generatePost(record.fields)
  })

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

  try {
    console.log('Writing locations.json')
    fs.writeFileSync(__dirname + '/locations.json', JSON.stringify(recordFieldsJSON, null, 2))
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
  records.forEach(function(record) {
    console.log('Retrieved', record.get('Name'));
  });
})

function generatePost(location) {
  count += 1
  let cta = callToAction(location)
  let fileString = `---
layout: base
permalink: "locations/${betterSlug(location.State)}/${betterSlug(location.City)}/${betterSlug(location.Name)}/"
tags: locations
title: ${location.Name}
state: ${location.State}
stateAbbr: ${getStateAbbr(location.State)}
hood: ${location.Neighborhood ? location.Neighborhood : location.City}
address: ${location.Address}
city: ${location.City}
zip: ${location.Zip}
mapUrl: "http://maps.apple.com/?q=${betterSlug(location.Name, '+', false)}&address=${betterSlug(location.Address, '+', false)},${betterSlug(location.City, '+', false)},${betterSlug(location.State, '+', false)},${location.Zip}"
locationType: ${location.LocationType}
phone: ${location.Phone}
website: ${location.Website}
onlineBooking: ${location.OnlineBooking}
closed: ${location.Closed}
closedUpdate: ${moment(location.LastClosedUpdate).format('MMMM Do, YYYY')}
notes: "${collectNotes(location)}"
${hoursOfOperation(location)}
ctaMessage: ${ctaMessage}
---
## ${location.Name}`

  try {
    fs.writeFileSync(process.cwd() + `/src/locations/location-${count}.md`, fileString)
  } catch (err) {
    console.error(err)
  }
}

function callToAction(location) {
  let cta = {
    message: "",
    url: "",
  }
  if (location.Website && location.OnlineBooking) {
    ctaMessage = `Schedule a test\nctaUrl: "${location.Website.trim()}"`
  } else if (location.Website) {
    ctaMessage = `Learn more\nctaUrl: "${location.Website.trim()}"`
  } else if (location.Phone) {
    ctaMessage = `Call ${location.Phone}\nctaUrl: "tel:${location.Phone.trim()}"`
  } else {
    ctaMessage = "No contact info available."
  }
  return cta
}

function collectNotes(location) {
  if (location.Notes) {
    let notesArr = location.Notes
    let otherNote = location.NotesOther
    let notes = ""
    let otherCount = 0

    notesArr.forEach((note) => {
      if (note !== "Other") {
        if (notes !== "") {
          notes = `${notes} ${note}`
        } else {
          notes = `${note}`
        }
      } else {
        otherCount += 1
      }
    })
    if (otherCount !== notesArr.length) {
      note = `${notes} ${otherNote}`
      return notes
    } else {
      note = `${otherNote}`
      return notes
    }
  }
  return ""
}

function hoursOfOperation(location) {
  let days = location.DaysOfWeek
  let opensAt = location.OpensAt
  let closesAt = location.ClosesAt
  let altDays = location.AltDaysOfWeek
  let altOpensAt = location.AltOpensAt
  let altClosesAt = location.AltClosesAt
  let alt2Days = location.Alt2DaysOfWeek
  let alt2OpensAt = location.Alt2OpensAt
  let alt2ClosesAt = location.Alt2ClosesAt

  let open = ""

  if (days && opensAt && closesAt) {
    if (opensAt === "Open 24 hours") {
      return "days: Open 24/7"
    } else {
      open = `days: ${dayCombos(days)}\nhours: ${opensAt}-${closesAt}`
      if (altDays && altOpensAt && altClosesAt) {
        open = open + `\naltDays: ${dayCombos(altDays)}\naltHours: ${altOpensAt}-${altClosesAt}`
      }
      if (alt2Days && alt2OpensAt && alt2ClosesAt) {
        open = open + `\nalt2Days: ${dayCombos(alt2Days)}\nalt2Hours: ${alt2OpensAt}-${alt2ClosesAt}`
      }
    }
  } else {
    return "days: Hours unknown"
  }
  return open
}

function betterSlug(input, replacement = "-", lower = true, options = {}) {
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
    replacement: replacement,
    remove: new RegExp("[" + escapeStringRegexp(options.removals) + "]", "g"),
    lower: lower
  })
}

function getStateAbbr( state ) {
  let parts
  let abbr
  let len
  let i

  // Ensure the first letter of each word comprising a state name is capitalized...
  parts = state.split( ' ' );
  len = parts.length;
  state = '';
  for ( i = 0; i < len; i++ ) {
    state += parts[ i ][ 0 ].toUpperCase() + parts[ i ].substring( 1 );
    if ( i < len-1 ) {
      state += ' ';
    }
  }
  // Get the state abbreviation:
  abbr = statesTable[ state ];

  // Ensure a valid state name was provided...
  if ( abbr === void 0 ) {
    throw new Error( 'unrecognized state name. Value: `' + state + '`.' );
  }
  return abbr;
}