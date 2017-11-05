module.exports = sequelize => {
  return {
    ShoppingItem: require('./shoppingItem')(sequelize)
  }
}
