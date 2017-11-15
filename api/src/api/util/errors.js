const capitalize = require('capitalize')
const HttpStatus = require('http-status-codes')

module.exports = ({

  catchError: promise => {
    return promise
    .then(result => ({ result }))
    .catch(error => ({ error }))
  },

  sendUnauthorizedError: res => {
    res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Wrong username or password.' })
  },

  sendForbiddenError: res => {
    res.status(HttpStatus.FORBIDDEN).send({ error: 'Insufficient permissions.' })
  },

  sendValidationError: (res, error) => {
    const messages = error && error.errors && error.errors.reduce((acc, err) => {
      if (err.type === 'notNull Violation') {
        return acc.concat([`${capitalize(err.path)} cannot be empty`])
      }
      else if (err.type === 'unique violation') {
        return acc.concat([`${capitalize(err.path)} is already taken`])
      }
      else if (err.type === 'Validation error') {
        return acc.concat([err.message])
      }
      return acc
    }, [])
    if (!messages.length) {
      throw new Error(`Unexpected validation error: ${JSON.stringify(error)}`)
    }
    res.status(HttpStatus.BAD_REQUEST).send({ error: messages.join('. ') })
  },

  sendBadRequestError: res => {
    res.status(HttpStatus.BAD_REQUEST).send({ error: 'Request is invalid.' })
  },

  sendNotFoundError: res => {
    res.status(HttpStatus.NOT_FOUND).send({ error: 'The intended record was not found.' })
  },

  sendUserExistsError: res => {
    res.status(HttpStatus.CONFLICT).send({ error: 'User already registered.' })
  },

  sendDeleteSelfError: res => {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ error: 'You cannot delete your own account.' })
  },

  sendInternalServerError: res => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Unexpected error while processing your request.' })
  }
})
