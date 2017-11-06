module.exports = db => Object.assign({},
  require('./items')(db)
)
