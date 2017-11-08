const validationUtil = require('../../util/validation')

module.exports = db => ({
  'POST /recover': [
    (req, res) => {
      if (!req.body
        || !req.body.email
        || !validationUtil.isValidEmail(req.body.email)
      ) {
        res.sendStatus(422)
        return
      }
      db.models.User.findOne({
        where: { email: req.body.email }
      }).then(user => {
        if (!user) {
          res.sendStatus(404)
          return
        }
        // TODO: send recovery email
        res.sendStatus(200)
      })
    }
  ]
})
