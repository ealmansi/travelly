
module.exports = {

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
