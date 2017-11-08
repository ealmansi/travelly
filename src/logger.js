const winston = require('winston')
const moment = require('moment')

const logger = new (winston.Logger)({
  level: process.env.LOG_LEVEL || 'debug',
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().toString()
    })
  ]
})

logger.disable = () => {
  logger.remove(winston.transports.Console)
}

module.exports = logger
