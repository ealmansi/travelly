const HttpStatus = require('http-status-codes')
const crypto = require('../../crypto')
const Sequelize = require('sequelize')

module.exports = db => {

  const Op = db.sequelize.Op
  const { rowToUser } = require('../util/response')
  const { isValidUserData } = require('../util/validation')(db)
  const { checkAccess, accessTypes } = require('../middleware/auth')(db)
  const { USER } = accessTypes

  return {

    /**
     * User login.
     */
    'POST /auth/login': [checkAccess([USER]), async (req, res, next) => {
      res.send(rowToUser(req.user))
    }],

    /**
     * User sign up.
     */
    'POST /auth/signup': [async (req, res, next) => {
      const userData = req.body
      if (!isValidUserData(userData) || userData.role) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      const existingUser = await db.models.User.findOne({
        where: { [Op.or]: [
          { username: { [Op.iLike]: userData.username} },
          { email: { [Op.iLike]: userData.email} }] }
      }).catch(next)
      if (existingUser) {
        res.sendStatus(HttpStatus.CONFLICT)
        return
      }
      const userSaveData = Object.assign({}, userData, {
        passwordHash: crypto.hashPassword(userData.password),
        role: role = 'user'
      })
      const user = await db.models.User.create(userSaveData).catch(next)
      if (!user) {
        res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        return
      }
      res.send(rowToUser(user))
    }]
  }
}
