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
    count += 1
    let cta = callToAction(location)
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
website: ${location.Website}
onlineBooking: ${location.OnlineBooking}
notes: "${collectNotes(location)}"
${hoursOfOperation(location)}
ctaMessage: ${ctaMessage}
---
## ${location.Name}`

  try {
    console.log(`${count} Generating ${location.Name}`)
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
  if (location.Closed && location.Website) {
    ctaMessage = `${location.LastClosedUpdate} Closed.\nclosed: true\nctaUrl: "${location.Website}.trim()"`
  } else if (location.Closed) {
    ctaMessage = `${location.LastClosedUpdate} Closed.\nclosed: true`
  } else if (location.Website && location.OnlineBooking) {
    ctaMessage = `Make an appointment\nctaUrl: "${location.Website}.trim()"`
  } else if (location.Website) {
    ctaMessage = `Learn more\nctaUrl: "${location.Website}.trim()"`
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
      console.log("NOTE:", note)
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
    console.log ("Other Count:", otherCount, "notesArr Length:", notesArr.length)
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
      open = `days: ${rangeDaysOfWeek(days)}\nhours: ${opensAt}-${closesAt}`
      if (altDays && altOpensAt && altClosesAt) {
        open = open + `\naltDays: ${rangeDaysOfWeek(altDays)}\naltHours: ${altOpensAt}-${altClosesAt}`
      }
      if (alt2Days && alt2OpensAt && alt2ClosesAt) {
        open = open + `\nalt2Days: ${rangeDaysOfWeek(alt2Days)}\nalt2Hours: ${alt2OpensAt}-${alt2ClosesAt}`
      }
    }
  } else {
    return "days: Hours unknown"
  }
  return open
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

  if (equals(days, all)) {
    range = "Everyday"
  } else if (equals(days, weekdays)) {
    range = "Weekdays"
  } else if (equals(days, weekends)) {
    range = "Weekends"
  } else if (equals(days, sunday)) {
    range = "Sundays"
  } else if (equals(days, monday)) {
    range = "Mondays"
  } else if (equals(days, tuesday)) {
    range = "Tuesdays"
  } else if (equals(days, wednesday)) {
    range = "Wednesdays"
  } else if (equals(days, thursday)) {
    range = "Thursdays"
  } else if (equals(days, friday)) {
    range = "Fridays"
  } else if (equals(days, saturday)) {
    range = "Saturdays"
  } else if (equals(days, mwf)) {
    range = "M, W, F"
  } else if (equals(days, tt)) {
    range = "Tu, Th"
  } else {
    range = "ERROR"
  }
  // TODOD: add remaining combos
  console.log(range)
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