const Sequelize = require('sequelize')

module.exports = sequelize => {
  return sequelize.define('shopping_item', {
    item: {
      type: Sequelize.STRING
    }
  })
}
