
module.exports = db => {
  
  const { parseListOpts } = require('../util/params')(db)
  const { sendTripsList, sendTrip } = require('../util/response')
  const { catchError, sendValidationError } = require('../util/errors')
  const { loadUser, loadTrip } = require('../middleware/db')(db)
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { LIST_TRIPS, VIEW_TRIP, CREATE_TRIP, EDIT_TRIP, DELETE_TRIP } = accessTypes
  const { LIST_USER_TRIPS, VIEW_USER_TRIP, CREATE_USER_TRIP, EDIT_USER_TRIP, DELETE_USER_TRIP } = accessTypes

  return {

    /**
     * Get list of trips.
     */
    'GET /trips': [
      checkAccess(LIST_TRIPS),
      async (req, res, next) => {
        const opts = parseListOpts(req)
        const { result, error } = await catchError(db.models.Trip.findAndCountAll(opts))
        if (error) {
          sendBadRequestError(res)
          return
        }
        sendTripsList(res, result.rows, opts.offset, opts.limit, result.count)
      }
    ],

    /**
     * Get trip with id = tripId.
     */
    'GET /trips/:tripId': [
      loadTrip,
      checkAccess(VIEW_TRIP),
      async (req, res, next) => {
        sendTrip(res, req.params.trip)
      }
    ],

    /**
     * Create trip.
     */
    'POST /trips': [
      checkAccess(CREATE_TRIP),
      async (req, res, next) => {
        const tripData = req.body
        const { result, error } = await catchError(db.models.Trip.create(tripData))
        if (error) {
          sendValidationError(res, error)
          return
        }
        sendTrip(res, result)
      }
    ],

    /**
     * Replace trip with id = tripId.
     */
    'PUT /trips/:tripId': [
      loadTrip,
      checkAccess(EDIT_TRIP),
      async (req, res, next) => {
        const tripData = Object.assign({}, req.body, { id: req.params.trip.id })
        const { result, error } = await catchError(req.params.trip.update(tripData))
        if (error) {
          sendValidationError(res, error)
          return
        }
        sendTrip(res, result)
      }
    ],

    /**
     * Delete trip with id = tripId.
     */
    'DELETE /trips/:tripId': [
      loadTrip,
      checkAccess(DELETE_TRIP),
      async (req, res, next) => {
        const copy = Object.assign({}, req.params.trip)
        await req.params.trip.destroy()
        sendTrip(res, copy)
      }
    ],

    /**
     * Get list of trips from user with id = userId.
     */
    'GET /users/:userId/trips': [
      loadUser,
      checkAccess(LIST_USER_TRIPS),
      async (req, res, next) => {
        const baseOpts = parseListOpts(req)
        const opts = Object.assign({}, baseOpts, {
          where: Object.assign({}, baseOpts.where || {}, {
            userId: req.params.user.id
          })
        })
        const { result, error } = await catchError(db.models.Trip.findAndCountAll(opts))
        if (error) {
          sendBadRequestError(res)
          return
        }
        sendTripsList(res, result.rows, opts.offset, opts.limit, result.count)
      }
    ],

    /**
     * Get trip with id = tripId, from user with id = userId.
     */
    'GET /users/:userId/trips/:tripId': [
      loadUser,
      loadTrip,
      checkAccess(VIEW_USER_TRIP),
      async (req, res, next) => {
        sendTrip(res, req.params.trip)
      }
    ],

    /**
     * Create trip for user with id = userId.
     */
    'POST /users/:userId/trips': [
      loadUser,
      checkAccess(CREATE_USER_TRIP),
      async (req, res, next) => {
        const tripData = Object.assign({}, req.body, { userId: req.params.user.id })
        const { result, error } = await catchError(db.models.Trip.create(tripData))
        if (error) {
          sendValidationError(res, error)
          return
        }
        sendTrip(res, result)
      }
    ],

    /**
     * Replace trip with id = tripId from user with id = userId.
     */
    'PUT /users/:userId/trips/:tripId': [
      loadUser,
      loadTrip,
      checkAccess(EDIT_USER_TRIP),
      async (req, res, next) => {
        const tripData = Object.assign({}, req.body, { id: req.params.trip.id, userId: req.params.user.id })
        const { result, error } = await catchError(req.params.trip.update(tripData))
        if (error) {
          sendValidationError(res, error)
          return
        }
        sendTrip(res, result)
      }
    ],

    /**
     * Delete trip with id = tripId from user with id = userId.
     */
    'DELETE /users/:userId/trips/:tripId': [
      loadUser,
      loadTrip,
      checkAccess(DELETE_USER_TRIP),
      async (req, res, next) => {
        const copy = Object.assign({}, req.params.trip)
        await req.params.trip.destroy()
        sendTrip(res, copy)
      }
    ]
  }
}
