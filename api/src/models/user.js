const Sequelize = require('sequelize')
const crypto = require('../util/crypto')

module.exports = sequelize => {

  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        validUsername(value) {
          if (!value || !(0 < value.length && value.length <= 100)) {
            throw new Error('Invalid username: it should be non-empty, and no longer than 100 characters.')
          }
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        validPassword(value) {
          if (!value || !(0 < value.length && value.length <= 100)) {
            throw new Error('Invalid password: it should be non-empty, and no longer than 100 characters.')
          }
        }
      }
    },
    role: {
      type: Sequelize.ENUM,
      values: ['user', 'manager', 'admin'],
      allowNull: false,
      validate: {
        validRole(value) {
          if (!value || !(['user', 'manager', 'admin'].includes(value))) {
            throw new Error('Invalid role: it should be either user, manager, or admin.')
          }
        }
      }
    }
  })

  User.addHook('beforeSave', (user, options) => {
    if (user.changed('password')) {
      const hash = crypto.hashPassword(user.get('password'))
      user.set('password', hash)
    }
  })

  return User
}
