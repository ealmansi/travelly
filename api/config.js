require('dotenv').config()

module.exports = {
  get: key => {
    if (!(key in process.env)) {
      throw new Error(`Required missing config value: ${key}.`)
    }
    return process.env[key]
  }
}
