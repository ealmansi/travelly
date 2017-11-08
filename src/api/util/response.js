const logger = require('../../logger')

let self
module.exports = self = {

  rowToUser: row => {
    if (!row) {
      throw new Error('Unexpected error: empty row.')
    }
    const { id, name, username, email, isAdmin, isManager } = row
    return { id, name, username, email, isAdmin, isManager }
  },

  rowToTrip: row => {
    if (!row) {
      throw new Error('Unexpected error: empty row.')
    }
    const { id, destination, startDate, endDate, comment, user } = row
    const responseUser = user ? self.rowToUser(user.dataValues) : null
    return { id, destination, startDate, endDate, comment, user: responseUser }
  },

  logAndReturn500: res => err => {
    logger.error(err)
    res.sendStatus(500)
  }
}
