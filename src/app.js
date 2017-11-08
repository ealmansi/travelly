const logger = require('./logger')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const crypto = require('./crypto')
const db = require('./db')
const api = require('./api')(db)

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.originalUrl}`)
  next()
})

passport.use(new BasicStrategy(
  (username, password, done) => {
    db.models.User.findOne({ where: { username: username } })
      .then(user => {
        if (!user || !crypto.validatePassword(password, user.passwordHash)) {
          return done(null, false)
        }
        return done(null, user)
      })
      .catch(err => {
        logger.error(err)
        return done(err)
      })
  }
))

for (let [version, routes] of Object.entries(api)) {
  for (let [route, spec] of Object.entries(routes)) {
    const [method, endpoint] = route.split(' ')
    const [handler, ...middleware] = spec.slice().reverse()
    app[method.toLowerCase()](version + endpoint, ...middleware.reverse(), handler)
    logger.info(`API end-point registered: ${method} ${version}${endpoint}.`)
  }
}

module.exports = app
