const { DateTime } = require('luxon')
const CleanCSS = require('clean-css')
const util = require('util')

module.exports = {
  dateToFormat: function (date, format) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(String(format))
  },

  dateToISO: function (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
      includeOffset: false,
      suppressMilliseconds: true
    })
  },

  cssmin: function (css) {
    return new CleanCSS({}).minify(css).styles
  },

  keys: function (obj) {
    return Object.keys(obj)
  },

  dump: function (obj) {
    return util.inspect(obj)
  }
}
