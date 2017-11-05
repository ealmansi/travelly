require('dotenv').config()
const port = process.env.PORT || 3005
const db = require('./src/db')
const app = require('./src/app')

db.sequelize.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port: ${port}.`)
    })
  })
