const Sequelize = require('sequelize')
const config = require('../config')
const crypto = require('../src/util/crypto')

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
    password: config.get('ADMIN_PASSWORD'),
    role: 'admin'
  }
}
else {
  admin = {
    username: config.get('TEST_ADMIN_USERNAME'),
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
      username: admin.username,
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
