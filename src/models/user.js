const Sequelize = require('sequelize')

module.exports = sequelize => {
  return sequelize.define('user', {
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      required: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      required: true
    },
    passwordHash: {
      type: Sequelize.STRING,
      required: true
    },
    role: {
      type: Sequelize.ENUM,
      values: ['user', 'manager', 'admin'],
      required: true
    }
  })
}
