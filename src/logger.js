const winston = require('winston')

winston.level = process.env.LOG_LEVEL || 'debug'

winston.disable = () => {
  winston.remove(winston.transports.Console)
}

module.exports = winston
