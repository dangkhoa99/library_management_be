const { regexEmail } = require('../constants/constants')

const validateEmail = (email) => {
  return String(email).toLowerCase().match(regexEmail)
}

module.exports = { validateEmail }
