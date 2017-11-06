module.exports = sequelize => {
  return {
    User: require('./user')(sequelize),
    ShoppingItem: require('./shoppingItem')(sequelize)
  }
}
