const HttpStatus = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = db => {
  
  const { rowToTrip } = require('../util/response')
  const { isValidTripData } = require('../util/validation')(db)
  const { loadUser, loadTrip } = require('../middleware/db')(db)
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { SELF, OWNER, ADMIN } = accessTypes

  return {

    /**
     * Get list of trips.
     */
    'GET /trips': [checkAccess([ADMIN]), async (req, res, next) => {
      const opts = {}
      if (req.query && req.query.offset && req.query.limit) {
        opts.offset = req.query.offset
        opts.limit = req.query.limit
      }
      const rows = await db.models.Trip.findAll(opts).catch(next)
      res.send(rows.map(rowToTrip))
    }],

    /**
     * Get list of trips for user with id = userId.
     */
    'GET /users/:userId/trips': [loadUser, checkAccess([SELF, ADMIN]), async (req, res, next) => {
      const opts = { where: { userId: req.params.user.id } }
      if (req.query && req.query.offset && req.query.limit) {
        opts.offset = req.query.offset
        opts.limit = req.query.limit
      }
      const rows = await db.models.Trip.findAll(opts).catch(next)
      res.send(rows.map(rowToTrip))
    }],

    /**
     * Get trip with id = tripId.
     */
    'GET /trips/:tripId': [loadTrip, checkAccess([OWNER, ADMIN]), async (req, res, next) => {
      res.send(rowToTrip(req.params.trip))
    }],

    /**
     * Create trip.
     */
    'POST /trips': [checkAccess([ADMIN]), async (req, res, next) => {
      const tripData = req.body
      if (!(await isValidTripData(tripData))) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const trip = await db.models.Trip.create(req.body).catch(next)
      if (!trip) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToTrip(trip))
    }],

    /**
     * Create trip for user with id = userId
     */
    'POST /users/:userId/trips': [loadUser, checkAccess([SELF, ADMIN]), async (req, res, next) => {
      const tripData = req.body
      if (!tripData.userId || tripData.userId !== req.params.user.id) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      if (!(await isValidTripData(tripData))) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const trip = await db.models.Trip.create(req.body).catch(next)
      if (!trip) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToTrip(trip))
    }],

    /**
     * Replace trip with id = tripId.
     */
    'PUT /trips/:tripId': [loadTrip, checkAccess([OWNER, ADMIN]), async (req, res, next) => {
      const tripData = req.body
      if (!(await isValidTripData(tripData))) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const trip = await req.params.trip.update(req.body)
      if (!trip) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToTrip(trip))
    }],

    /**
     * Delete trip with id = tripId.
     */
    'DELETE /trips/:tripId': [loadTrip, checkAccess([OWNER, ADMIN]), async (req, res, next) => {
      await req.params.trip.destroy()
      res.sendStatus(HttpStatus.OK)
    }]
  }
}
