module.exports = db => ({
  ['/v1']: require('./v1')(db),
  ['/auth']: require('./auth')(db)
})
