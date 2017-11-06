const getRequestHandlerFromApi = api => route => {
  const [handler] = api[route].slice(-1)
  return handler
}

module.exports = {
  getRequestHandlerFromApi: getRequestHandlerFromApi
}
