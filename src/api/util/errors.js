const HttpStatus = require('http-status-codes')

module.exports = ({

  catchError: promise => {
    return promise
    .then(result => ({ result }))
    .catch(error => ({ error }))
  },

  sendUnauthorizedError: res => {
    res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Invalid username or password.' })
  },

  sendForbiddenError: res => {
    res.status(HttpStatus.FORBIDDEN).send({ error: 'Insufficient permissions.' })
  },

  sendValidationError: (res, error) => {
    const messages = error && error.errors && error.errors.reduce((acc, err) => {
      return err.type === 'Validation error' ?
          acc.concat([err.message]) :
          acc
    }, [])
    if (!messages) {
      throw new Error('Unexpected validation error.')
    }
    res.status(HttpStatus.BAD_REQUEST).send({ error: messages.join('. ') })
  },

  sendUserExistsError: res => {
    res.status(HttpStatus.CONFLICT).send({ error: 'User already registered.' })
  },

  sendDeleteSelfError: res => {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ error: 'You cannot delete your own account.' })
  }
})
