const port = process.env.PORT || 3005
const db = require('./src/db')
const app = require('./src/app')
const logger = require('./src/logger')

db.initialize()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Listening on port: ${port}.`)
    })
  })
  .catch(err => {
    logger.error('Failed to initialize database.', err)
  })
