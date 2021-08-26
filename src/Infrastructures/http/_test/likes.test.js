const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const injections = require('../../injections')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 404 when threadId unavailable', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123456/comments/comment-123456/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 when commentId unavailable', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken('1')
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

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-123456/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })

    it('should response 200 when correctly', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken('1')
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
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'dicoding comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
