const HttpStatus = require('http-status-codes')
const crypto = require('../../crypto')
const Sequelize = require('sequelize')

module.exports = db => {
  
  const Op = db.sequelize.Op
  const { rowToUser } = require('../util/response')
  const { isValidUserData } = require('../util/validation')(db)
  const { loadUser } = require('../middleware/db')(db)
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { SELF, MANAGER, ADMIN } = accessTypes

  return {

    /**
     * Get list of users.
     */
    'GET /users': [checkAccess([MANAGER, ADMIN]), async (req, res, next) => {
      const opts = {}
      if (req.query && req.query.offset && req.query.limit) {
        opts.offset = req.query.offset
        opts.limit = req.query.limit
      }
      const rows = await db.models.User.findAll(opts).catch(next)
      res.send(rows.map(rowToUser))
    }],

    /**
     * Get user with id = userId.
     */
    'GET /users/:userId': [loadUser, checkAccess([SELF, MANAGER, ADMIN]), async (req, res, next) => {
      res.send(rowToUser(req.params.user))
    }],

    /**
     * Create user.
     */
    'POST /users': [checkAccess([MANAGER, ADMIN]), async (req, res, next) => {
      const userData = req.body
      if (!isValidUserData(userData)) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      if (req.user.role !== 'admin' && userData.role) {
        res.sendStatus(HttpStatus.UNAUTHORIZED)
        return
      }
      const existingUser = await db.models.User.findOne({
        where: { [Op.or]: [
          { username: { [Op.iLike]: userData.username } },
          { email: { [Op.iLike]: userData.email } }] }
      }).catch(next)
      if (existingUser) {
        res.sendStatus(HttpStatus.CONFLICT)
        return
      }
      const userSaveData = Object.assign({}, userData, {
        passwordHash: crypto.hashPassword(userData.password),
        role: userData.role || 'user'
      })
      const user = await db.models.User.create(userSaveData).catch(next)
      if (!user) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToUser(user))
    }],

    /**
     * Replace user with id = userId.
     */
    'PUT /users/:userId': [loadUser, checkAccess([SELF, MANAGER, ADMIN]), async (req, res, next) => {
      const userData = req.body
      if (!isValidUserData(userData)) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      if (req.user.role !== 'admin' && userData.role) {
        res.sendStatus(HttpStatus.UNAUTHORIZED)
        return
      }
      const userSaveData = Object.assign({}, userData, {
        passwordHash: crypto.hashPassword(userData.password),
        role: userData.role || 'user'
      })
      const user = await req.params.user.update(userData).catch(next)
      if (!user) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToUser(user))
    }],

    /**
     * Delete user with id = userId.
     */
    'DELETE /users/:userId': [loadUser, checkAccess([SELF, MANAGER, ADMIN]), async (req, res, next) => {
      if (req.user.id === req.params.user.id) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      await db.models.Trip.destroy({ where: { userId: req.params.user.id } }).catch(next)
      await req.params.user.destroy().catch(next)
      res.sendStatus(HttpStatus.OK)
    }]
  }
}
