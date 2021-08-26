const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const injections = require('../../injections')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/commments/{commentId}/replies', () => {
    it('should response 404 when threadId unavailable', async () => {
      // Arrange
      const requestPayload = {
        content: 'Dicoding Indonesia reply',
      }
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123456/comments/comment-123/replies',
        payload: requestPayload,
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
      const requestPayload = {
        content: 'Dicoding Indonesia reply',
      }
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
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-123/replies`,
        payload: requestPayload,
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

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding reply',
      }
      // eslint-disable-next-line no-undef
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia reply',
      }
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      }
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
        'tidak dapat membuat reply baru karena tipe data tidak sesuai',
      )
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 404 when threadId unavailable', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const server = await createServer(injections)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123456/comments/comment-123456/replies/reply-123',
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
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-123456/replies/reply-123`,
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

    it('should response 404 when replyId unavailable', async () => {
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
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('reply tidak ditemukan')
    })

    it('should response 403 when not comment owner', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken('1')
      const accessToken2 = await ServerTestHelper.getAccessToken('2')
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
      // add reply
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'dicoding reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: {
          addedReply: { id: replyId },
        },
      } = JSON.parse(reply.payload)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('reply bukan milik anda')
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
      // add reply
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'dicoding reply',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: {
          addedReply: { id: replyId },
        },
      } = JSON.parse(reply.payload)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
