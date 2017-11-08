const Sequelize = require('sequelize')
const crypto = require('../src/crypto')

const sequelize = new Sequelize('database', 'username', 'password', { 
  dialect: 'sqlite', 
  storage: ':memory:',
  logging: false,  
  operatorsAliases: false
})

const models = require('../src/models')(sequelize)

const initialize = () => {
  return sequelize.sync({ force: true })
    .then(() => {
      return models.User.findOrCreate({
        where: {
          username: 'test_admin_username'
        },
        defaults: {
          name: 'test_admin_name',
          username: 'test_admin_username',
          email: 'test_admin_email',
          passwordHash: crypto.hashPassword('test_admin_password'),
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
