module.exports = db => ({
  ['/item']: require('./item')(db),
  ['/items']: require('./items')(db)
})
