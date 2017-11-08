const responseUtil = require('../../util/response')

module.exports = db => {
  const authMiddleware = require('../../middleware/auth')(db)

  return {
    'POST /login': [
      authMiddleware.isLoggedIn,
      (req, res) => {
        res.send(responseUtil.rowToUser(req.user))
      }
    ]
  }
}
