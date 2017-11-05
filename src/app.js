const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const routes = require('./routes')(db)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

for (let [route, handlers] of Object.entries(routes)) {
  if (handlers.get) {
    app.get(route, handlers.get)
  }
  if (handlers.post) {
    app.post(route, handlers.post)
  }
  if (handlers.delete) {
    app.delete(route, handlers.delete)
  }
}

module.exports = app
