const { catchError, sendBadRequestError, sendNotFoundError } = require('../util/errors')
const HttpStatus = require('http-status-codes')
const logger = require('../../logger')

module.exports = db => {

  return {

    loadUser: async (req, res, next) => {
      const { result, error } = await catchError(db.models.User.findOne({ where: { id: req.params.userId } }))
      if (error) {
        sendBadRequestError(res)
        return
      }
      if (!result) {
        sendNotFoundError(res)
        return
      }
      req.params.user = result
      next()
    },

    loadTrip: async (req, res, next) => {
      const { result, error } = await catchError(db.models.Trip.findOne({ where: { id: req.params.tripId } }))
      if (error) {
        sendBadRequestError(res)
        return
      }
      if (!result) {
        sendNotFoundError(res)
        return
      }
      req.params.trip = result
      next()
    }
  }
}
