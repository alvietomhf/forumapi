const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'First comment',
    }
    const user = {
      id: 'user-DWrT3pXe1hccYkV1eIAxS',
      username: 'vito',
    }
    const newComment = new AddedComment({
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: payload.content,
      owner: user.id,
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(newComment))

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // Action
    const addedComment = await getCommentUseCase.execute({
      payload,
      user,
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    })

    // Assert
    expect(addedComment).toStrictEqual(newComment)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      'thread-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockCommentRepository.addComment).toBeCalledWith({
      newComment: new NewComment({
        content: payload.content,
      }),
      user,
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
    })
  })
})
