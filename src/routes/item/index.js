const logger = require('../../logger')

module.exports = db => ({
  post: (req, res) => {
    if (!req.body.item) {
      res.sendStatus(422)
    }
    return db.models.ShoppingItem.create({ item: req.body.item })
      .then(() => res.sendStatus(200))
      .catch(err => {
        logger.error(err)
        res.sendStatus(500)
      })
  },
  delete: (req, res) => {
    if (!req.query.item) {
      res.sendStatus(422)
    }
    return db.models.ShoppingItem.destroy({ where: { item: req.query.item } })
      .then(() => res.sendStatus(200))
      .catch(err => {
        logger.error(err)
        res.sendStatus(500)
      })
  }
})
