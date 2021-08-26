const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}) // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository)
  })

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable()
      await CommentsTableTestHelper.cleanTable()
      await RepliesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
      await pool.end()
    })

    describe('addThread function', () => {
      it('should persist new user and return added thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'dicoding thread',
          body: 'this is dicoding thread',
        })
        const user = {
          id: 'user-DWrT3pXe1hccYkV1eIAxS',
          username: 'vito',
        }
        const fakeIdGenerator = () => '123456' // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
        )

        // Action
        const addedThread = await threadRepositoryPostgres.addThread({
          newThread,
          user,
        })

        // Assert
        const threads = await ThreadsTableTestHelper.findThreadById(
          'thread-123456',
        )
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123456',
            title: 'dicoding thread',
            owner: 'user-DWrT3pXe1hccYkV1eIAxS',
          }),
        )
        expect(threads).toHaveLength(1)
      })
    })

    describe('getThreadById', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        // Action & Assert
        await expect(
          threadRepositoryPostgres.getThreadById('thread-123'),
        ).rejects.toThrowError(NotFoundError)
      })

      it('should return thread correctly', async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({ id: 'thread-321' })
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        // Action
        const thread = await threadRepositoryPostgres.getThreadById(
          'thread-321',
        )

        // Assert
        expect(thread.id).toEqual('thread-321')
      })
    })
  })
})
