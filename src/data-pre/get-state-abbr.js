const statesTable = require('datasets-us-states-names-abbr')

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
    throw new Error('unrecognized state name. Value: `' + state + '`.');
  }
  return abbr;
}