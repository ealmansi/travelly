const HttpStatus = require('http-status-codes')
const passport = require('passport')
const basicAuth = require('basic-auth')
const { validatePassword } = require('../../util/crypto')
const { sendUnauthorizedError, sendForbiddenError } = require('../util/errors')

module.exports = db => {

  const [USER, MANAGER, ADMIN] = db.models.User.rawAttributes.role.values

  let self

  return self = {

    accessTypes: {
      LOG_IN: 'LOG_IN',
      LIST_USERS: 'LIST_USERS',
      VIEW_USER: 'VIEW_USER',
      CREATE_USER: 'CREATE_USER',
      EDIT_USER: 'EDIT_USER',
      DELETE_USER: 'DELETE_USER',
      LIST_TRIPS: 'LIST_TRIPS',
      VIEW_TRIP: 'VIEW_TRIP',
      CREATE_TRIP: 'CREATE_TRIP',
      EDIT_TRIP: 'EDIT_TRIP',
      DELETE_TRIP: 'DELETE_TRIP',
      LIST_USER_TRIPS: 'LIST_USER_TRIPS',
      VIEW_USER_TRIP: 'VIEW_USER_TRIP',
      CREATE_USER_TRIP: 'CREATE_USER_TRIP',
      EDIT_USER_TRIP: 'EDIT_USER_TRIP',
      DELETE_USER_TRIP: 'DELETE_USER_TRIP'
    },

    checkAccess: accessType => async (req, res, next) => {
      const user = await self.getAuthenticatedUser(req)
      if (!user) {
        sendUnauthorizedError(res)
        return
      }
      if (!self.hasAccess(user, accessType, req)) {
        sendForbiddenError(res)
        return
      }
      req.user = user
      next()
    },

    getAuthenticatedUser: async req => {
      const credentials = basicAuth(req)
      if (!credentials) {
        return null
      }
      const user = await db.models.User.findOne({ where: { username: credentials.name } })
      if (!user || !validatePassword(credentials.pass, user.password)) {
        return null
      }
      return user
    },

    hasAccess: (user, accessType, req) => {
      switch (accessType) {
      case self.accessTypes.LOG_IN:
        return true
      case self.accessTypes.LIST_USERS:
        return self.hasRole(user, MANAGER)
            || self.hasRole(user, ADMIN)
      case self.accessTypes.VIEW_USER:
        return self.isSelf(user, req.params.user)
            || self.hasRole(user, MANAGER)
            || self.hasRole(user, ADMIN)
      case self.accessTypes.CREATE_USER:
        return self.hasRole(user, MANAGER) && self.hasRole(req.body, USER)
            || self.hasRole(user, ADMIN)
      case self.accessTypes.EDIT_USER:
        return self.isSelf(user, req.params.user) && self.hasRole(req.body, USER)
          || self.hasRole(user, MANAGER) && self.hasRole(req.params.user, USER)
          || self.hasRole(user, ADMIN)
      case self.accessTypes.DELETE_USER:
        return self.isSelf(user, req.params.user)
            || self.hasRole(user, MANAGER) && self.hasRole(req.params.user, USER)
            || self.hasRole(user, ADMIN)
      case self.accessTypes.LIST_TRIPS:
      case self.accessTypes.VIEW_TRIP:
      case self.accessTypes.CREATE_TRIP:
      case self.accessTypes.EDIT_TRIP:
      case self.accessTypes.DELETE_TRIP:
        return self.hasRole(user, ADMIN)
      case self.accessTypes.LIST_USER_TRIPS:
      case self.accessTypes.VIEW_USER_TRIP:
      case self.accessTypes.CREATE_USER_TRIP:
      case self.accessTypes.EDIT_USER_TRIP:
      case self.accessTypes.DELETE_USER_TRIP:
        return self.isSelf(user, req.params.user)
            || self.hasRole(user, ADMIN)
      default:
        throw new Error(`Unexpected access type: ${accessType}.`)
      }
      return false
    },

    hasRole(user, role) {
      return user && user.role && user.role.toLowerCase() === role
    },

    isSelf(user, reqParamsUser) {
      return reqParamsUser && reqParamsUser.id === user.id
    }
  }
}
