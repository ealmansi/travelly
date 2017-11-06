const authUtil = require('../util')
const bcrypt = require('bcrypt')

module.exports = db => ({
  'POST /signup': [
    (req, res) => {
      if (!req.body
        || !req.body.name
        || !req.body.username
        || !req.body.email
        || !req.body.password
      ) {
        res.sendStatus(422)
        return
      }
      if (req.user) {
        res.sendStatus(409)
        return
      }
      db.models.User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: false,
      }).then(() => {
        res.sendStatus(200)
      })
    }
  ]
})
