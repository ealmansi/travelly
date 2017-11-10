
module.exports = api => {

  return {

    getHandler: route => {
      const [handler] = api[route].slice(-1)
      return handler
    },
  
    getMockResponseObject: () => {
      let self
      return self = {
        response: null,
        status: null,
        send: response => {
          self.response = response
        },
        sendStatus: status => {
          self.status = status
        }
      }
    }
  }
}
