const JSONParse = require('json-parse-safe')

module.exports = db => {

  const Op = db.sequelize.Op

  let self

  return self = {

    getListOptions : (req, res, next) => {
      const opts = self.parseListOpts(req)
      if (opts === null) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return
      }
      req.list = { opts }
      next()
    },

    parseListOpts: req => {
      const opts = {}
      if (!req.query) {
        return opts
      }
      const { start, end, sort, order, filter } = req.query
      if (start !== undefined && end !== undefined) {
        opts.offset = start
        opts.limit = end - start + 1
      }
      if (sort !== undefined && order !== undefined) {
        opts.order = [ [sort, order] ]
      }
      if (filter !== undefined) {
        const filters = JSONParse(filter).value
        if (Array.isArray(filters) && filters.length > 0) {
          const clauses = filters.map(([attr, value]) => {
            if (attr === 'role') {
              return { role: value }
            }
            else {
              return {
                [attr]: { [Op.iLike]: `%${value}%` }
              }
            }
          })
          opts.where = { [Op.and]: clauses }
        }
      }
      return opts
    }
  }
}
