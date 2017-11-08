// RFC 5322 Official Standard
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

let self
module.exports = self = {
  isValidEmail: email => {
    return emailRegex.test(email)
  },

  isValidUserPartialData: candidate => {
    return true
  },

  isValidUserData: candidate => {
    if (!candidate) {
      return false
    }
    if (!candidate.username) {
      return false
    }
    if (!candidate.email || !self.isValidEmail(candidate.email)) {
      return false
    }
    return true
  },

  isValidTripPartialData: candidate => {
    return true
  },

  isValidTripData: candidate => {
    if (!candidate) {
      return false
    }
    if (!candidate.destination) {
      return false
    }
    if (!candidate.startDate) {
      return false
    }
    if (!candidate.endDate) {
      return false
    }
    if (!candidate.userId) {
      return false
    }
    return true
  }
}
