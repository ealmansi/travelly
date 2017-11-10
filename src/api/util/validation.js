// RFC 5322 Official Standard
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

module.exports = db => {
  
  let self
  
  return self = {
    isValidEmail: email => {
      return emailRegex.test(email)
    },
  
    isValidUserData: userData => {
      if (!userData) {
        return false
      }
      if (userData.id || userData.createdAt || userData.updatedAt) {
        return false
      }
      if (!userData.username) {
        return false
      }
      if (!userData.email || !self.isValidEmail(userData.email)) {
        return false
      }
      if (!userData.password) {
        return false
      }
      if (userData.role && !db.models.User.rawAttributes.role.values.includes(userData.role)) {
        return false
      }
      return true
    },
  
    isValidTripData: async tripData => {
      if (!tripData) {
        return false
      }
      if (tripData.id || tripData.createdAt || tripData.updatedAt) {
        return false
      }
      if (!tripData.destination) {
        return false
      }
      if (!tripData.startDate) {
        return false
      }
      if (!tripData.endDate) {
        return false
      }
      if (!tripData.userId) {
        return false
      }
      const owner = await db.models.User.findOne({ where: { id: tripData.userId } })
      if (!owner) {
        return false
      }
      return true
    }
  }
}

