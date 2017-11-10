const HttpStatus = require('http-status-codes')
const logger = require('../../logger')

module.exports = db => {

  return {

    loadUser: async (req, res, next) => {
      if (!req.params || !req.params.userId) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const user = await db.models.User.findOne({ where: { id: req.params.userId } })
      if (!user) {
        res.sendStatus(HttpStatus.NOT_FOUND)
        return
      }
      req.params.user = user
      next()
    },

    loadTrip: async (req, res, next) => {
      if (!req.params || !req.params.tripId) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const trip = await db.models.Trip.findOne({ where: { id: req.params.tripId } })
      if (!trip) {
        res.sendStatus(HttpStatus.NOT_FOUND)
        return
      }
      req.params.trip = trip
      next()
    },

    getTrip: (req, res, next) => {
      if (!req.params || !req.params.tripId) {
        res.sendStatus(404)
        return
      }
      db.models.Trip.findOne({
          where: { id: req.params.tripId },
          include: [{ model: db.models.User }]
        })
        .then(trip => {
          if (!trip) {
            res.sendStatus(404)
            return
          }
          req.params.trip = trip
          next()
        })
        .catch(err => {
          logger.error(err)
          res.sendStatus(500)
        })
    },

    getUser: (req, res, next) => {
      if (!req.params || !req.params.userId) {
        res.sendStatus(404)
        return
      }
      db.models.User.findOne({ where: { id: req.params.userId } })
        .then(user => {
          if (!user) {
            res.sendStatus(404)
            return
          }
          req.params.user = user
          next()
        })
        .catch(err => {
          logger.error(err)
          res.sendStatus(500)
        })
    }
  }
}
