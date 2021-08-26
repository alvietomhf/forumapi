const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    options: {
      auth: false,
    },
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    options: {
      auth: false,
    },
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    options: {
      auth: false,
    },
    handler: handler.deleteAuthenticationHandler,
  },
]

module.exports = routes
