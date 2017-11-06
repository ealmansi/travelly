const passport = require('passport')

module.exports = {
  isLoggedIn: passport.authenticate('basic', { session: false })
}
