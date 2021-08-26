/* istanbul ignore file */
const createServer = require('../src/Infrastructures/http/createServer')
const injections = require('../src/Infrastructures/injections')

const ServerTestHelper = {
  async getAccessToken(id) {
    const server = await createServer(injections)

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: `dicoding${id}`,
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    })

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: `dicoding${id}`,
        password: 'secret',
      },
    })
    const responseJson = JSON.parse(response.payload)

    return responseJson.data.accessToken
  }
}

module.exports = ServerTestHelper
