
module.exports = db => {

  const Op = db.sequelize.Op
  const { sendUser } = require('../util/response')
  const { catchError, sendValidationError, sendUserExistsError } = require('../util/errors')
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { LOG_IN } = accessTypes

  return {

    /**
     * User sign-up.
     */
    'POST /auth/signup': [
      async (req, res, next) => {
        const userData = Object.assign({}, req.body, { role: 'user' })
        const { result, error } = await catchError(db.models.User.findOrCreate({
          where: {
            username: {
              [Op.iLike]: userData.username
            }
          },
          defaults: userData
        }))
        if (error) {
          sendValidationError(res, error)
          return
        }
        const [user, created] = result
        if (!created) {
          sendUserExistsError(res)
          return
        }
        sendUser(res, user)
      }
    ],

    /**
     * User log-in.
     */
    'POST /auth/login': [
      checkAccess(LOG_IN),
      async (req, res, next) => {
        sendUser(res, req.user)
      }
    ]
  }
}
