const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const pool = require('../../database/postgres/pool')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}) // dummy dependency

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository)
  })

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
      await ThreadsTableTestHelper.cleanTable()
      await RepliesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
      await pool.end()
    })

    describe('addReply function', () => {
      it('should persist new user and return added comment correctly', async () => {
        // Arrange
        const newReply = new NewReply({
          content: 'dicoding reply',
        })
        const user = {
          id: 'user-DWrT3pXe1hccYkV1eIAxS',
          username: 'vito',
        }
        const fakeIdGenerator = () => '123456' // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )

        // Action
        const addedReply = await replyRepositoryPostgres.addReply({
          newReply,
          user,
          commentId: 'comment-h_W1Plfpj0TY7wyT2PUPP',
        })

        // Assert
        const replies = await RepliesTableTestHelper.findReplyById(
          'reply-123456',
        )
        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: 'reply-123456',
            content: 'dicoding reply',
            owner: 'user-DWrT3pXe1hccYkV1eIAxS',
          }),
        )
        expect(replies).toHaveLength(1)
      })
    })

    describe('getReplyById', () => {
      it('should throw NotFoundError when reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action & Assert
        await expect(
          replyRepositoryPostgres.getReplyById('reply-123'),
        ).rejects.toThrowError(NotFoundError)
      })

      it('should return reply correctly', async () => {
        // Arrange
        await RepliesTableTestHelper.addReply({ id: 'reply-321' })
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action
        const reply = await replyRepositoryPostgres.getReplyById('reply-321')

        // Assert
        expect(reply.id).toEqual('reply-321')
      })
    })

    describe('deleteReply', () => {
      it('should change isDelete comment to true', async () => {
        // Arrange
        const replyRepository = new ReplyRepositoryPostgres(pool, {})
        await RepliesTableTestHelper.addReply({
          id: 'reply-321',
          owner: 'user-1234',
        })

        // Action
        await replyRepository.deleteReply({
          reply: {
            id: 'reply-321',
            owner: 'user-1234',
          },
          user: {
            id: 'user-1234',
          },
        })

        // Assert
        const replies = await RepliesTableTestHelper.findReplyById('reply-321')
        expect(replies[0].isdelete).toStrictEqual(true)
      })

      it('should forbidden if not reply owner', async () => {
        // Arrange
        const replyRepository = new ReplyRepositoryPostgres(pool, {})

        // Action
        await RepliesTableTestHelper.addReply({
          id: 'reply-321',
          owner: 'user-1234',
        })

        // Assert
        await expect(
          replyRepository.deleteReply({
            reply: {
              id: 'reply-321',
              owner: 'user-1234',
            },
            user: {
              id: 'user-1235',
            },
          }),
        ).rejects.toThrowError(AuthorizationError)
      })
    })

    describe('getReplyByCommentIds function', () => {
      it('should return all reply filtered by commentid correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123' })
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          commentId: 'comment-123',
        })
        await RepliesTableTestHelper.addReply({
          id: 'reply-321',
          commentId: 'comment-123',
        })
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action
        const replies = await replyRepositoryPostgres.getReplyByCommentIds([
          'comment-123',
        ])

        // Assert
        expect(replies).toHaveLength(2)
      })
    })
  })
})
