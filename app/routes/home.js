function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/start',
  handler: (request, h) => {
    request.yar.reset()
    return h.view('home', createModel())
  }
}
