const passport = require('passport')

module.exports = db => {

  return {
    isLoggedIn: authenticationMiddleware(
      (user, params) => {
        return user
      }
    ),

    hasGeneralTripAccess: authenticationMiddleware(
      (user, params) => {
        return user && user.isAdmin
      }
    ),
    
    hasSpecificTripAccess: authenticationMiddleware(
      (user, params) => {
        return user && (user.isAdmin || params.trip && params.trip.userId === user.id)
      }
    ),
    
    hasUserTripsAccess: authenticationMiddleware(
      (user, params) => {
        return user && (user.isAdmin || params.user && params.user.id === user.id)
      }
    ),

    hasGeneralUserAccess: authenticationMiddleware(
      (user, params) => {
        return user && (user.isManager || user.isAdmin)
      }
    ),

    hasSpecificUserAccess: authenticationMiddleware(
      (user, params) => {
        return user && (user.isManager || user.isAdmin || params.user && params.user.id === user.id)
      }
    )
  }

  function authenticationMiddleware(predicate) {
    return (req, res, next) => {
      const callback = authenticateByPredicate(predicate, req, res, next)
      passport.authenticate('basic', { session: false }, callback)(req, res, next)
    }
  }
  
  function authenticateByPredicate(predicate, req, res, next) {
    return (err, user, info) => {
      if(err) {
        res.sendStatus(500)
      }
      if (!predicate(user, req.params)) {
        res.sendStatus(401)
      }
      else {
        req.user = user
        next()
      }
    }
  }
}
