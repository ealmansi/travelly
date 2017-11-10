module.exports = sequelize => {
  return {
    User: require('./user')(sequelize),
    Trip: require('./trip')(sequelize)
  }
}
