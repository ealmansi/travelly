module.exports = db => ({
  ['/v1']: require('./v1')(db)
})
