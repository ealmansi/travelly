const authUtil = require('../util')

module.exports = db => ({
  'POST /login': [
    authUtil.isLoggedIn,
    (req, res) => {
      res.sendStatus(200)
    }
  ]
})
