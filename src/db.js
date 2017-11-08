const Sequelize = require('sequelize')
const config = require('../config')
const crypto = require('../src/crypto')

const isProductionEnv = config.get('ENV') === 'production' 

const databaseUri = isProductionEnv
  ? config.get('DATABASE_URI')
  : config.get('TEST_DATABASE_URI')

const sequelize = new Sequelize(databaseUri, {
  logging: config.get('DATABASE_LOGGING') === 'true' ? console.log : false,
  operatorsAliases: false
})

const models = require('./models')(sequelize)

let admin
if (isProductionEnv) {
  admin = {
    username: config.get('ADMIN_USERNAME'),
    name: config.get('ADMIN_NAME'),
    username: config.get('ADMIN_USERNAME'),
    email: config.get('ADMIN_EMAIL'),
    passwordHash: crypto.hashPassword(config.get('ADMIN_PASSWORD')),
    isAdmin: true
  }
}
else {
  admin = {
    username: config.get('TEST_ADMIN_USERNAME'),
    name: config.get('TEST_ADMIN_NAME'),
    username: config.get('TEST_ADMIN_USERNAME'),
    email: config.get('TEST_ADMIN_EMAIL'),
    passwordHash: crypto.hashPassword(config.get('TEST_ADMIN_PASSWORD')),
    isAdmin: true
  }
}

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
