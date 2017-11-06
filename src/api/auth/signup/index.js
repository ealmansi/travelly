const authUtil = require('../util')

module.exports = db => ({
  'POST /signup': [
    (req, res) => {
      console.log(req.body.name, req.body.email, req.body.password)
      res.sendStatus(200)
    }
  ]
})
