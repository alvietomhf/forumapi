const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}) // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository)
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

    describe('addComment function', () => {
      it('should persist new user and return added comment correctly', async () => {
        // Arrange
        const newComment = new NewComment({
          content: 'dicoding comment',
        })
        const user = {
          id: 'user-DWrT3pXe1hccYkV1eIAxS',
          username: 'vito',
        }
        const fakeIdGenerator = () => '123456' // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )

        // Action
        const addedComment = await commentRepositoryPostgres.addComment({
          newComment,
          user,
          threadId: 'thread-h_W1Plfpj0TY7wyT2PUPP',
        })

        // Assert
        const comments = await CommentsTableTestHelper.findCommentById(
          'comment-123456',
        )
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-123456',
            content: 'dicoding comment',
            owner: 'user-DWrT3pXe1hccYkV1eIAxS',
          }),
        )
        expect(comments).toHaveLength(1)
      })
    })

    describe('getCommentById', () => {
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        )

        // Action & Assert
        await expect(
          commentRepositoryPostgres.getCommentById('comment-123'),
        ).rejects.toThrowError(NotFoundError)
      })

      it('should return comment correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-321' })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        )

        // Action
        const comment = await commentRepositoryPostgres.getCommentById(
          'comment-321',
        )

        // Assert
        expect(comment.id).toEqual('comment-321')
      })
    })

    describe('deleteComment', () => {
      it('should change isDelete comment to true', async () => {
        // Arrange
        const commentRepository = new CommentRepositoryPostgres(pool, {})
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          owner: 'user-1234',
        })

        // Action
        await commentRepository.deleteComment({
          comment: {
            id: 'comment-321',
            owner: 'user-1234',
          },
          user: {
            id: 'user-1234',
          },
        })

        // Assert
        const comments = await CommentsTableTestHelper.findCommentById(
          'comment-321',
        )
        expect(comments[0].isdelete).toStrictEqual(true)
      })

      it('should forbidden if not comment owner', async () => {
        // Arrange
        const commentRepository = new CommentRepositoryPostgres(pool, {})

        // Action
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          owner: 'user-1234',
        })

        // Assert
        await expect(
          commentRepository.deleteComment({
            comment: {
              id: 'comment-321',
              owner: 'user-1234',
            },
            user: {
              id: 'user-1235',
            },
          }),
        ).rejects.toThrowError(AuthorizationError)
      })
    })

    describe('getCommentByThreadId function', () => {
      it('should return all comment filtered by threadid correctly', async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
        })
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          threadId: 'thread-123',
        })
        await RepliesTableTestHelper.addReply({
          id: 'reply-321',
          commentId: 'comment-123',
        })
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        )

        // Action
        const comments = await commentRepositoryPostgres.getCommentByThreadId(
          'thread-123',
        )

        // Assert
        expect(comments).toHaveLength(2)
      })
    })
  })
})
