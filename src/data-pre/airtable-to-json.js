const slugify = require('slugify')
const escapeStringRegexp = require("escape-string-regexp")
const moment = require('moment')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
const Airtable = require('airtable')
const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE)
const dayCombos = require('./day-combos')
const getStateAbbr = require('./get-state-abbr')

var recordFieldsJSON = []
var count = 0
var names = {}
var citiesByState = {}

base('Testing Locations').select({
  maxRecords: 9999,
  view: "Verified Locations",
  sort: [
    {field: "State", direction: "asc"},
    {field: "City", direction: "asc"},
    {field: "Neighborhood", direction: "asc"}
  ]
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  records.forEach(function(record) {
    recordFieldsJSON.push(record.fields)
    // console.log(record.fields)
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
  try {
    console.log('Writing cities-by-state files...')
    for (let [state, cities] of Object.entries(citiesByState)) {
      let citiesSet = new Set(cities)
      let citiesString = Array.from(citiesSet).join(' ')
      fs.writeFileSync(process.cwd() + `/src/includes/cities-by-state/${state.toLowerCase()}-cities.njk`, citiesString)
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
  records.forEach(function(record) {
    console.log('Retrieved', record.get('Name'));
  });
})

function generatePost(location) {
  count += 1
  let cta = callToAction(location)
  let nameNoDuplicate = ""
  let nameTrimmed = location.Name.trim()

  if (names[nameTrimmed] || names[nameTrimmed] === 0) {
    names[nameTrimmed] += 1
    nameNoDuplicate = `${nameTrimmed}-${names[nameTrimmed]}`
  } else {
    names[nameTrimmed] = 0
    nameNoDuplicate = nameTrimmed
  }

  if (citiesByState[location.State]) {
    citiesByState[location.State].push(location.City)
  } else {
    citiesByState[location.State] = [location.City]
  }

  let fileString = `---
layout: location-page
date: Last Modified
description: "Local COVID-19 testing is available at ${location.Name.trim()} in ${location.City}, ${location.State}, USA."
permalink: "locations/${betterSlug(location.State)}/${betterSlug(location.City)}/${betterSlug(nameNoDuplicate)}/"
tags:
  - locations
  - ${betterSlug(location.State)}
title: ${location.Name}
state: ${location.State}
stateAbbr: ${getStateAbbr(location.State)}
hood: "${location.Neighborhood ? location.Neighborhood : location.City}"
address: "${location.Address ? location.Address : ''}"
city: "${location.City}"
zip: "${location.Zip ? location.Zip : ''}"
mapUrl: "http://maps.apple.com/?q=${betterSlug(location.Name, '+', false)}&address=${location.Address ? betterSlug(location.Address, '+', false) : ''},${betterSlug(location.City, '+', false)},${betterSlug(location.State, '+', false)},${location.Zip ? location.Zip : ''}"
locationType: ${typeOfLocation(location)}
phone: "${location.Phone}"
website: "${location.Website}"
onlineBooking: ${location.OnlineBooking}
closed: ${location.Closed}
closedUpdate: ${moment(location.LastClosedUpdate).format('MMMM Do, YYYY')}
notes: "${collectNotes(location)}"
${hoursOfOperation(location)}
ctaMessage: ${ctaMessage}
---`

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

function typeOfLocation(location) {
  if (location.LocationType) {
    if (location.LocationType.length === 2) {
      return "Drive-thru or walk-in"
    } else if (location.LocationType.length === 1) {
      return location.LocationType[0]
    } else {
      return "Please contact for drive-thru/walk-in availability."
    }
  } else {
    return "Please contact for drive-thru/walk-in availability."
  }
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
    return "days: Contact for hours of operation."
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
