const Sequelize = require('sequelize')

module.exports = sequelize => {
  return sequelize.define('user', {
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    passwordHash: {
      type: Sequelize.STRING
    },
    isAdmin: {
      type: Sequelize.BOOLEAN
    }
  })
}
