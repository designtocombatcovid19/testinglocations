const phoneFns = require('phone-fns')

module.exports = function (phoneNumber) {
  return phoneFns.format('NNN-NNN-NNNN', phoneNumber.trim().replace(/^(?:1-|1\s|1|\+1-|\+1\s)/, ''))
}