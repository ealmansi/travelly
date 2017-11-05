const Sequelize = require('sequelize')

const databaseUri = process.env.ENV === 'production'
  ? process.env.DATABASE_URI
  : process.env.TEST_DATABASE_URI

const sequelize = new Sequelize(databaseUri, {
  logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false,
  operatorsAliases: false
})

const db = {
  sequelize: sequelize,
  models: require('./models')(sequelize)
}

module.exports = db
