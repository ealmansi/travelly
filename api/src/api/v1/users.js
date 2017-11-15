
module.exports = db => {

  const Op = db.sequelize.Op
  const { sendUsersList, sendUser } = require('../util/response')
  const { parseListOpts } = require('../util/params')(db)
  const { catchError, sendBadRequestError, sendValidationError, sendDeleteSelfError } = require('../util/errors')
  const { loadUser } = require('../middleware/db')(db)
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { LIST_USERS, VIEW_USER, CREATE_USER, EDIT_USER, DELETE_USER } = accessTypes

  return {

    /**
     * Get list of users.
     */
    'GET /users': [
      checkAccess(LIST_USERS),
      async (req, res, next) => {
        const opts = parseListOpts(req)
        const {result, error} = await catchError(db.models.User.findAndCountAll(opts))
        if (error) {
          sendBadRequestError(res)
          return
        }
        sendUsersList(res, result.rows, opts.offset, opts.limit, result.count)
      }
    ],

    /**
     * Get user with id = userId.
     */
    'GET /users/:userId': [
      loadUser,
      checkAccess(VIEW_USER),
      async (req, res, next) => {
        sendUser(res, req.params.user)
      }
    ],

    /**
     * Create user.
     */
    'POST /users': [
      checkAccess(CREATE_USER),
      async (req, res, next) => {
        const userData = req.body
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
     * Replace user with id = userId.
     */
    'PUT /users/:userId': [
      loadUser,
      checkAccess(EDIT_USER),
      async (req, res, next) => {
        const userData = Object.assign({}, req.body, { id: req.params.user.id })
        const { error } = await catchError(req.params.user.update(userData))
        if (error) {
          sendValidationError(res, error)
          return
        }
        sendUser(res, req.params.user)
      }
    ],

    /**
     * Delete user with id = userId.
     */
    'DELETE /users/:userId': [
      loadUser,
      checkAccess(DELETE_USER),
      async (req, res, next) => {
        if (req.user.id === req.params.user.id) {
          sendDeleteSelfError(res)
          return
        }
        const copy = Object.assign({}, req.params.user.dataValues)
        await req.params.user.destroy()
        sendUser(res, copy)
      }
    ]
  }
}
