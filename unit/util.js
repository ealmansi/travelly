
module.exports = api => {

  return {

    getHandler: route => {
      const [handler] = api[route].slice(-1)
      return handler
    },
  
    getMockResponseObject: () => {
      let self
      return self = {
        sentResponse: null,
        sentStatus: null,
        send: response => {
          self.sentResponse = response
          return self
        },
        status: status => {
          self.sentStatus = status
          return self
        }
      }
    }
  }
}
