const HttpStatus = require('http-status-codes')

module.exports = (() => {

  let self

  return self = {
    
    sendUser: (res, user) => {
      res.send({ data: self.rowToUser(user) })
    },

    sendTrip: (res, trip) => {
      res.send({ data: self.rowToTrip(trip) })
    },

    sendUsersList: (res, rows, offset, limit, count) => {
      res.send({ data: rows.map(self.rowToUser), total: count })
    },

    sendTripsList: (res, rows, offset, limit, count) => {
      res.send({ data: rows.map(self.rowToTrip), total: count })
    },

    rowToUser: row => {
      if (!row) {
        throw new Error('Unexpected error: empty row.')
      }
      const { id, name, username, email, role } = row
      return { id, name, username, email, role }
    },

    rowToTrip: row => {
      if (!row) {
        throw new Error('Unexpected error: empty row.')
      }
      const { id, destination, startDate, endDate, comment, userId } = row
      return { id, destination, startDate, endDate, comment, userId }
    }
  }
})()
