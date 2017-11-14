module.exports = db => Object.assign({},
  require('./auth')(db),
  require('./users')(db),
  require('./trips')(db)
)
