const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    options: {
      auth: false,
    },
    handler: handler.postUserHandler,
  },
]

module.exports = routes
