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

const initialize = () => {
  return sequelize.sync({ force: false })
    .then(() => {
      return models.User.findOrCreate({
        where: {
          username: config.get('ADMIN_USERNAME')
        },
        defaults: {
          name: config.get('ADMIN_NAME'),
          username: config.get('ADMIN_USERNAME'),
          email: config.get('ADMIN_EMAIL'),
          passwordHash: bcrypt.hashSync(config.get('ADMIN_PASSWORD'), 10),
          isAdmin: true
        }
      })
    })
}

module.exports = {
  sequelize: sequelize,
  models: models,
  initialize: initialize
}
