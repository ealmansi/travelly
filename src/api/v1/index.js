module.exports = db => Object.assign({},
  require('./items')(db),
  require('./users')(db),
  require('./trips')(db)
)
