const logger = require('./util/logger')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const api = require('./api')(db)
const { sendInternalServerError } = require('./api/util/errors')

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use((req, res, next) => {
  logger.info(`Received request: ${req.method} ${req.originalUrl}`)
  next()
})

for (let [version, routes] of Object.entries(api)) {
  for (let [route, spec] of Object.entries(routes)) {
    const [verb, endpoint] = route.split(' ')
    const [handler, ...reversedMiddleware] = spec.slice().reverse()
    const method = verb.toLowerCase()
    const versionEndpoint = `${version}${endpoint}`
    const wrappedMiddleware = reversedMiddleware.reverse().map(errorHandler)
    const wrappedHandler = errorHandler(handler)
    app[method](versionEndpoint, ...wrappedMiddleware, wrappedHandler)
    logger.info(`API end-point registered: ${verb} ${versionEndpoint}.`)
  }
}

function errorHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    }
    catch (err) {
      next(err)
    }
  }
}

app.use(function (err, req, res, next) {
  logger.error(err)
  sendInternalServerError(res)
})

module.exports = app
