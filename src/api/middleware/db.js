const logger = require('../../logger')

module.exports = db => {

  return {
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
