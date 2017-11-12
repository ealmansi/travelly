const Sequelize = require('sequelize')
const moment = require('moment')

module.exports = sequelize => {

  const User = require('./user')(sequelize)

  const Trip = sequelize.define('trip', {
    destination: {
      type: Sequelize.STRING,
      validate: {
        validDestination(value) {
          if (!value || !(0 < value.length && value.length <= 100)) {
            throw new Error('Invalid destination: it should be non-empty, and no longer than 100 characters.')
          }
        }
      }
    },
    startDate: {
      type: Sequelize.DATE,
      validate: {
        validStartDate(value) {
          if (!value) {
            throw new Error('Invalid start date: it should be non-empty.')
          }
        }
      }
    },
    endDate: {
      type: Sequelize.DATE,
      validate: {
        validEndDate(value) {
          if (!value) {
            throw new Error('Invalid end date: it should be non-empty.')
          }
        }
      }
    },
    comment: {
      type: Sequelize.STRING,
      validate: {
        validComment(value) {
          if (value && value.length > 100) {
            throw new Error('Invalid comment: it should not be longer than 100 characters.')
          }
        }
      }
    }
  }, {
    validate: {
      validDateRange() {
        if (this.startDate && this.endDate && !moment(this.startDate).isBefore(this.endDate)) {
          throw new Error('Invalid date range: start date should precede end date.')
        }
      }
    }
  })
  
  User.hasMany(Trip)

  Trip.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

  return Trip
}
