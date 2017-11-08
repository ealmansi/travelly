const Sequelize = require('sequelize')

module.exports = sequelize => {
  const User = require('./user')(sequelize)
  const Trip = sequelize.define('trip', {
    destination: {
      type: Sequelize.STRING,
      required: true
    },
    startDate: {
      type: Sequelize.DATE,
      required: true
    },
    endDate: {
      type: Sequelize.DATE,
      required: true
    },
    comment: {
      type: Sequelize.STRING
    }
  })
  Trip.belongsTo(User)
  User.hasMany(Trip)
  return Trip
}
