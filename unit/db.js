const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', { 
  dialect: 'sqlite', 
  storage: ':memory:',
  logging: false,  
  operatorsAliases: false
}) 

const db = {
  sequelize: sequelize,
  models: require('../src/models')(sequelize)
}

module.exports = db
