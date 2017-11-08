const Sequelize = require('sequelize')
const Op = Sequelize.Op
const crypto = require('../../../crypto')
const logger = require('../../../logger')
const responseUtil = require('../../util/response')
const validationUtil = require('../../util/validation')

module.exports = db => {
  const authMiddleware = require('../../middleware/auth')(db)

  return {
    'POST /signup': [
      (req, res) => {
        if (!req.body || !validationUtil.isValidUserData(req.body)) {
          res.sendStatus(422)
          return
        }
        const userData = Object.assign(req.body, {
          email: req.body.email.toLowerCase(),
          passwordHash: crypto.hashPassword(req.body.password),
          isAdmin: false,
          isManager: false,
        })
        db.models.User.create(userData)
          .then(user => {
            res.send(responseUtil.rowToUser(user))
          })
          .catch(err => {
            if (err.errors && err.errors[0] && err.errors[0].type &&
                err.errors[0].type === 'unique violation') {
              res.sendStatus(409)
              return
            }
            throw err
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ]
  }
}
