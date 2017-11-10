const HttpStatus = require('http-status-codes')
const passport = require('passport')
const basicAuth = require('basic-auth')
const { validatePassword } = require('../../crypto')


module.exports = db => {

  let self

  return self = {

    accessTypes: {
      USER: 'USER',         // Authenticated user, all resources.
      MANAGER: 'MANAGER',   // Authenticated manager, all resources.
      ADMIN: 'ADMIN',       // Authenticated admin, all resources.
      SELF: 'SELF',         // Authenticated user, own record.
      OWNER: 'OWNER'        // Authenticated user, owned records.
    },

    checkAccess: accessSpecs => async (req, res, next) => {
      try {
        const user = await self.getAuthenticatedUser(req)
        if (!user || !self.satisfiesSpecs(user, accessSpecs, req)) {
          res.sendStatus(HttpStatus.UNAUTHORIZED)
          return
        }
        req.user = user
        next()
      }
      catch (err) {
        next(err)
      }
    },

    getAuthenticatedUser: async req => {
      const credentials = basicAuth(req)
      if (!credentials) {
        return null
      }
      const user = await db.models.User.findOne({ where: { username: credentials.name } })
      if (!user || !validatePassword(credentials.pass, user.passwordHash)) {
        return null
      }
      return user
    },

    satisfiesSpecs: (user, accessSpecs, req) => {
      for (var i = 0; i < accessSpecs.length; i++) {
        const accessSpec = accessSpecs[i]
        switch (accessSpec) {
        case self.accessTypes.USER:
          return true
        case self.accessTypes.MANAGER:
          if (user.role === 'manager') {
            return true
          }
          break
        case self.accessTypes.ADMIN:
          if (user.role === 'admin') {
            return true
          }
          break
        case self.accessTypes.SELF:
          if (req.params.user && req.params.user.id === user.id) {
            return true
          }
          break
        case self.accessTypes.OWNER:
          if (req.params.trip && req.params.trip.userId === user.id) {
            return true
          }
          break
        default:
          throw new Error(`Unexpected access type: ${accessSpec}.`)
        }
      }
      return false
    }
  }
}
