const logger = require('../../../logger')
const responseUtil = require('../../util/response')
const validationUtil = require('../../util/validation')

module.exports = db => {
  const dbMiddleware = require('../../middleware/db')(db)
  const authMiddleware = require('../../middleware/auth')(db)

  return {
    'GET /users': [
      authMiddleware.hasGeneralUserAccess,
      (req, res) => {
        db.models.User.findAll()
          .then(rows => {
            res.send(rows.map(responseUtil.rowToUser))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'POST /user': [
      authMiddleware.hasGeneralUserAccess,
      (req, res) => {
        if (!req.body || !validationUtil.isValidUserData(req.body)) {
          res.sendStatus(422)
          return
        }
        db.models.User.create(req.body)
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
    ],
    'DELETE /user/:userId': [
      dbMiddleware.getUser,
      authMiddleware.hasGeneralUserAccess,
      (req, res) => {
        if (req.user.id === req.params.user.id) {
          res.sendStatus(422)
          return
        }
        db.models.User.destroy({ where: { id: req.params.user.id } })
          .then(() => res.sendStatus(200))
          .catch(responseUtil.logAndReturn500(res))
      }
    ],
    'GET /user/:userId': [
      dbMiddleware.getUser,
      authMiddleware.hasSpecificUserAccess,
      (req, res) => {
        res.send(responseUtil.rowToUser(req.params.user))
      }
    ],
    'PATCH /user/:userId': [
      dbMiddleware.getUser,
      authMiddleware.hasSpecificUserAccess,
      (req, res) => {
        if (!req.body || !validationUtil.isValidUserPartialData(req.body)) {
          res.sendStatus(422)
          return
        }
        req.params.user.update(req.body)
          .then(user => {
            res.send(responseUtil.rowToUser(user))
          })
          .catch(responseUtil.logAndReturn500(res))
      }
    ]
  }
}
