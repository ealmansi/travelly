const bcrypt = require('bcrypt')

module.exports = {
  hashPassword: password => bcrypt.hashSync(password, 10),
  validatePassword: (password, hash) => bcrypt.compareSync(password, hash)
}
