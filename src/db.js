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
    name: config.get('ADMIN_NAME'),
    username: config.get('ADMIN_USERNAME'),
    email: config.get('ADMIN_EMAIL'),
    password: config.get('ADMIN_PASSWORD'),
    role: 'admin'
  }
}
else {
  admin = {
    name: config.get('TEST_ADMIN_NAME'),
    username: config.get('TEST_ADMIN_USERNAME'),
    email: config.get('TEST_ADMIN_EMAIL'),
    password: config.get('TEST_ADMIN_PASSWORD'),
    role: 'admin'
  }
}

const initialize = async () => {
  await sequelize.sync({ force: !isProductionEnv })
  return models.User.findOrCreate({
    where: {
      username: admin.username
    },
    defaults: {
      name: admin.name,
      username: admin.username,
      email: admin.email,
      password: admin.password,
      role: admin.role
    }
  })
}

module.exports = {
  sequelize: sequelize,
  models: models,
  initialize: initialize
}
