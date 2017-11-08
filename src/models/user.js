const Sequelize = require('sequelize')

module.exports = sequelize => {
  return sequelize.define('user', {
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    passwordHash: {
      type: Sequelize.STRING
    },
    isAdmin: {
      type: Sequelize.BOOLEAN
    },
    isManager: {
      type: Sequelize.BOOLEAN
    }
  })
}
