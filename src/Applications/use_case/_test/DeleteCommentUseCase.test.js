const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const comment = {
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      owner: 'user-123',
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comment))
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ comment, user: { id: 'user-123' } }))

    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // Act
    await getCommentUseCase.execute({
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      commentId: comment.id,
      user: { id: 'user-123' },
    })

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      'thread-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      'comment-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockCommentRepository.deleteComment).toBeCalledWith({
      comment,
      user: {
        id: 'user-123',
      },
    })
  })
})
