module.exports = db => ({
  get: (req, res) => {
    return db.models.ShoppingItem.findAll()
      .then(rows => res.send(rows.map(row => row.item)))
      .catch(() => res.sendStatus(500))
  }
})
