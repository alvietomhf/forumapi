const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {}) // dummy dependency

    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository)
  })

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable()
      await ThreadsTableTestHelper.cleanTable()
      await RepliesTableTestHelper.cleanTable()
      await LikesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
      await pool.end()
    })

    describe('likeComment', () => {
      it('should create new like if not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123456' // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )

        // Action
        await likeRepositoryPostgres.likeComment({
          commentId: 'comment-321',
          user: {
            id: 'user-1234',
          },
        })

        // Assert
        const likes = await LikesTableTestHelper.findLike(
          'comment-321',
          'user-1234',
        )
        expect(likes[0].islike).toStrictEqual(true)
      })

      it('should dislike if islike equal to true', async () => {
        // Arrange
        const fakeIdGenerator = () => '123456' // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )
        await LikesTableTestHelper.addLike({
          id: 'like-123',
          commentId: 'comment-321',
          owner: 'user-1234',
          islike: true,
        })

        // Action
        await likeRepositoryPostgres.likeComment({
          commentId: 'comment-321',
          user: {
            id: 'user-1234',
          },
        })

        // Assert
        const likes = await LikesTableTestHelper.findLike(
          'comment-321',
          'user-1234',
        )
        expect(likes[0].islike).toStrictEqual(false)
      })

      it('should like if islike equal to false', async () => {
        // Arrange
        const fakeIdGenerator = () => '123456' // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )
        await LikesTableTestHelper.addLike({
          id: 'like-123',
          commentId: 'comment-321',
          owner: 'user-1234',
          islike: false,
        })

        // Action
        await likeRepositoryPostgres.likeComment({
          commentId: 'comment-321',
          user: {
            id: 'user-1234',
          },
        })

        // Assert
        const likes = await LikesTableTestHelper.findLike(
          'comment-321',
          'user-1234',
        )
        expect(likes[0].islike).toStrictEqual(true)
      })
    })

    describe('getLikeByCommentIds function', () => {
      it('should return all like filtered by commentid correctly', async () => {
        // Arrange
        await CommentsTableTestHelper.addComment({ id: 'comment-123' })
        await LikesTableTestHelper.addLike({
          id: 'like-123',
          commentId: 'comment-123',
        })
        await LikesTableTestHelper.addLike({
          id: 'like-321',
          commentId: 'comment-123',
        })
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

        // Action
        const likes = await likeRepositoryPostgres.getLikeByCommentIds([
          'comment-123',
        ])

        // Assert
        expect(likes).toHaveLength(2)
      })
    })
  })
})
