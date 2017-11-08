const logger = require('../../../logger')

module.exports = db => {
  const authMiddleware = require('../../middleware/auth')(db)
  
  return {
    'POST /item': [
      authMiddleware.isLoggedIn,
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
      authMiddleware.isLoggedIn,
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
      authMiddleware.isLoggedIn,
      (req, res) => {
        db.models.ShoppingItem.findAll()
          .then(rows => res.send(rows.map(row => row.item)))
          .catch(() => res.sendStatus(500))
      }
    ]
  }
}
