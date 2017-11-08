const logger = require('../../../logger')
const validationUtil = require('../../util/validation')
const responseUtil = require('../../util/response')

module.exports = db => {
  const dbMiddleware = require('../../middleware/db')(db)
  const authMiddleware = require('../../middleware/auth')(db)

  return {
    'GET /trips': [
      authMiddleware.hasGeneralTripAccess,
      (req, res) => {
        db.models.Trip.findAll({ include: [ db.models.User ] })
          .then(rows => {
            res.send(rows.map(responseUtil.rowToTrip))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'POST /trip': [
      authMiddleware.hasGeneralTripAccess,
      (req, res) => {
        if (!req.body || !validationUtil.isValidTripData(req.body)) {
          res.sendStatus(422)
          return
        }
        db.models.Trip.create(req.body)
          .then(trip => {
            res.send(responseUtil.rowToTrip(trip))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'GET /trip/:tripId': [
      dbMiddleware.getTrip,
      authMiddleware.hasSpecificTripAccess,
      (req, res) => {
        res.send(responseUtil.rowToTrip(req.params.trip))
      }
    ],
    'PATCH /trip/:tripId': [
      dbMiddleware.getTrip,
      authMiddleware.hasSpecificTripAccess,
      (req, res) => {
        if (!req.body || !validationUtil.isValidTripPartialData(req.body)) {
          res.sendStatus(422)
          return
        }
        req.params.trip.update(req.body)
          .then(trip => {
            res.send(responseUtil.rowToTrip(trip))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'DELETE /trip/:tripId': [
      dbMiddleware.getTrip,
      authMiddleware.hasSpecificTripAccess,
      (req, res) => {
        db.models.Trip.destroy({ where: { id: req.params.trip.id } })
          .then(() => res.sendStatus(200))
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'GET /user/:userId/trips': [
      dbMiddleware.getUser,
      authMiddleware.hasUserTripsAccess,
      (req, res) => {
        db.models.Trip.findAll({ where: { userId: req.params.user.id }})
          .then(rows => {
            res.send(rows.map(responseUtil.rowToTrip))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'POST /user/:userId/trip': [
      dbMiddleware.getUser,
      authMiddleware.hasUserTripsAccess,
      (req, res) => {
        if (!req.body) {
          res.sendStatus(422)
          return
        }
        const tripData = Object.assign(req.body, { userId: req.params.user.id })
        if (!validationUtil.isValidTripData(tripData)) {
          res.sendStatus(422)
          return
        }
        db.models.Trip.create(tripData)
          .then(trip => {
            res.send(responseUtil.rowToTrip(trip))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ]
  }
}
