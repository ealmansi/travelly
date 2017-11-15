const Sequelize = require('sequelize')
const crypto = require('../src/util/crypto')

const sequelize = new Sequelize('database', 'username', 'password', { 
  dialect: 'sqlite', 
  storage: ':memory:',
  logging: false,  
  operatorsAliases: false
})

// Hack: sqlite does not support iLike.
sequelize.Op.iLike = sequelize.Op.like

const models = require('../src/models')(sequelize)

const initialize = async () => {
  await sequelize.sync({ force: true })
  await models.User.findOrCreate({
    where: {
      username: 'test_admin_username'
    },
    defaults: {
      username: 'test_admin_username',
      password: 'test_admin_password',
      role: 'admin'
    }
  })
}

module.exports = {
  sequelize: sequelize,
  models: models,
  initialize: initialize
}
