module.exports = db => ({
  db: require('./db')(db),
  auth: require('./auth')(db)
})
