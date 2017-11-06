const logger = require('../../../logger')
const authUtil = require('../../auth/util')

module.exports = db => ({
  'POST /item': [
    authUtil.isLoggedIn,
    (req, res) => {
      if (!req.body.item) {
        res.sendStatus(422)
        return
      }
      db.models.ShoppingItem.create({ item: req.body.item })
        .then(() => res.sendStatus(200))
        .catch(err => {
          logger.error(err)
          res.sendStatus(500)
        })
    }
  ],
  'DELETE /item': [
    authUtil.isLoggedIn,
    (req, res) => {
      if (!req.query.item) {
        res.sendStatus(422)
        return
      }
      db.models.ShoppingItem.destroy({ where: { item: req.query.item } })
        .then(() => res.sendStatus(200))
        .catch(err => {
          logger.error(err)
          res.sendStatus(500)
        })
    }
  ],
  'GET /items': [
    authUtil.isLoggedIn,
    (req, res) => {
      db.models.ShoppingItem.findAll()
        .then(rows => res.send(rows.map(row => row.item)))
        .catch(() => res.sendStatus(500))
    }
  ]
})
