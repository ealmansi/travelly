const config = require('../config')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')

const databaseUri = config.get('ENV') === 'production'
  ? config.get('DATABASE_URI')
  : config.get('TEST_DATABASE_URI')

const sequelize = new Sequelize(databaseUri, {
  logging: config.get('DATABASE_LOGGING') === 'true' ? console.log : false,
  operatorsAliases: false
})

const models = require('./models')(sequelize)

const productionAdmin = {
  username: config.get('ADMIN_USERNAME'),
  name: config.get('ADMIN_NAME'),
  username: config.get('ADMIN_USERNAME'),
  email: config.get('ADMIN_EMAIL'),
  passwordHash: bcrypt.hashSync(config.get('ADMIN_PASSWORD'), 10),
  isAdmin: true
}

const testingAdmin = {
  username: config.get('TEST_ADMIN_USERNAME'),
  name: config.get('TEST_ADMIN_NAME'),
  username: config.get('TEST_ADMIN_USERNAME'),
  email: config.get('TEST_ADMIN_EMAIL'),
  passwordHash: bcrypt.hashSync(config.get('TEST_ADMIN_PASSWORD'), 10),
  isAdmin: true
}

const admin = config.get('ENV') === 'production'
  ? productionAdmin
  : testingAdmin

const initialize = () => {
  return sequelize.sync({ force: false })
    .then(() => {
      return models.User.findOrCreate({
        where: {
          username: admin.username
        },
        defaults: {
          name: admin.name,
          username: admin.username,
          email: admin.email,
          passwordHash: admin.passwordHash,
          isAdmin: admin.isAdmin
        }
      })
    })
}

module.exports = {
  sequelize: sequelize,
  models: models,
  initialize: initialize
}
