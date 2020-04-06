var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key8F05dieLVDdWGB'}).base('appxDx8kYWLSNJgwQ');

var recordFieldsJSON = []

base('Testing Locations').select({
    maxRecords: 9999,
    view: "Verified Locations",
    sort: [{field: "State", direction: "asc"}]
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    //console.log(JSON.stringify(records, null, 2))
    records.forEach(function(record) {
      recordFieldsJSON.push(record.fields)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    console.log(JSON.stringify(recordFieldsJSON, null, 2))
}, function done(err) {
    if (err) { console.error(err); return; }
});

// If you only want the first page of records, you can
// use `firstPage` instead of `eachPage`.
base('Testing Locations').select({
    view: 'Verified Locations'
}).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    records.forEach(function(record) {
        console.log('Retrieved', record.get('Name'));
    });
});
