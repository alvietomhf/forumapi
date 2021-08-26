const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const injections = require('../../injections')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding thread',
        body: 'Dicoding Indonesia',
      }
      // eslint-disable-next-line no-undef
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia thread',
      }
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding thread',
        body: true,
      }
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      )
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when threadId unavailable', async () => {
      // Arrange
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 200 and persisted thread', async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const accessToken2 = await ServerTestHelper.getAccessToken('2')
      const accessToken3 = await ServerTestHelper.getAccessToken('3')
      const server = await createServer(injections)
      // add thread
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding thread',
          body: 'Dicoding Indonesia',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(thread.payload)
      // add comment
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'dicoding comment 1',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      })
      const secondComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'dicoding comment 2',
        },
        headers: {
          Authorization: `Bearer ${accessToken3}`,
        },
      })
      const {
        data: {
          addedComment: { id: secondCommentId },
        },
      } = JSON.parse(secondComment.payload)
      // add reply
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${secondCommentId}/replies`,
        payload: {
          content: 'dicoding reply 1',
        },
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1)
    }, 60000)
  })
})
