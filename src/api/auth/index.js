module.exports = db => Object.assign({},
  require('./login')(db),
  require('./signup')(db)
)
