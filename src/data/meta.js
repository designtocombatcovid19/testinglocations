require('dotenv').config()
const {
  META_TITLE,
  META_URL,
  META_DESC,
  META_LANG,
  META_COLOR,
  META_EMAIL,
  META_TELEPHONE
} = process.env

module.exports = {
  title: META_TITLE || 'COVID-19 Testing Locations',
  url: META_URL || '',
  description: META_DESC || 'Locations and requirements for coronavirus testing in the United States.',
  lang: META_LANG || 'en',
  primaryColor: META_COLOR || '#DB0000',
  email: META_EMAIL || undefined,
  telephone: META_TELEPHONE || undefined,
  dateFormat: 'dd LLLL yyyy'
}
