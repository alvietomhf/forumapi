const NewThread = require('../../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../../Thread/AddThreadUseCase')

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'First Thread',
      body: 'My First Thread',
    }
    const user = {
      id: 'user-DWrT3pXe1hccYkV1eIAxS',
      username: 'vito',
    }
    const newThread = new AddedThread({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: payload.title,
      owner: user.id,
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(newThread))

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    })

    // Action
    const addedThread = await getThreadUseCase.execute({ payload, user })

    // Assert
    expect(addedThread).toStrictEqual(newThread)
    expect(mockThreadRepository.addThread).toBeCalledWith({
      newThread: new NewThread({
        title: payload.title,
        body: payload.body,
      }),
      user,
    })
  })
})
