const statesTable = {
  "Alabama":"AL",
  "Alaska":"AK",
  "Arizona":"AZ",
  "Arkansas":"AR",
  "California":"CA",
  "Colorado":"CO",
  "Connecticut":"CT",
  "DC":"DC",
  "Delaware":"DE",
  "District Of Columbia":"DC",
  "Florida":"FL",
  "Georgia":"GA",
  "Hawaii":"HI",
  "Idaho":"ID",
  "Illinois":"IL",
  "Indiana":"IN",
  "Iowa":"IA",
  "Kansas":"KS",
  "Kentucky":"KY",
  "Louisiana":"LA",
  "Maine":"ME",
  "Maryland":"MD",
  "Massachusetts":"MA",
  "Michigan":"MI",
  "Minnesota":"MN",
  "Mississippi":"MS",
  "Missouri":"MO",
  "Montana":"MT",
  "Nebraska":"NE",
  "Nevada":"NV",
  "New Hampshire":"NH",
  "New Jersey":"NJ",
  "New Mexico":"NM",
  "New York":"NY",
  "North Carolina":"NC",
  "North Dakota":"ND",
  "Ohio":"OH",
  "Oklahoma":"OK",
  "Oregon":"OR",
  "Pennsylvania":"PA",
  "Rhode Island":"RI",
  "South Carolina":"SC",
  "South Dakota":"SD",
  "Tennessee":"TN",
  "Texas":"TX",
  "Utah":"UT",
  "Vermont":"VT",
  "Virginia":"VA",
  "Washington":"WA",
  "Washington DC":"DC",
  "West Virginia":"WV",
  "Wisconsin":"WI",
  "Wyoming":"WY",
}

module.exports = function (state) {
  let parts
  let abbr
  let len
  let i

  // Ensure the first letter of each word comprising a state name is capitalized...
  parts = state.split(' ');
  len = parts.length;
  state = '';
  for (i = 0; i < len; i++) {
    state += parts[i][0].toUpperCase() + parts[i].substring(1);
    if (i < len-1) {
      state += ' ';
    }
  }
  // Get the state abbreviation:
  abbr = statesTable[state];

  // Ensure a valid state name was provided...
  if (abbr === void 0) {
    throw new Error(`Unrecognized state name: ${state}.`);
  }
  return abbr;
}
