const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    options: {
      auth: false,
    },
    handler: handler.showThreadHandler,
  },
]

module.exports = routes
