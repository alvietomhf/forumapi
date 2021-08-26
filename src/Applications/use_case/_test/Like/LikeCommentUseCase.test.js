const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const LikeRepository = require('../../../../Domains/likes/LikeRepository')
const LikeCommentUseCase = require('../../Like/LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const comment = {
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      owner: 'user-123',
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockLikeRepository = new LikeRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockLikeRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ commentId: comment.id, user: { id: 'user-123' } }))

    const getLikeUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    })

    // Act
    await getLikeUseCase.execute({
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
    expect(mockLikeRepository.likeComment).toBeCalledWith({
      commentId: comment.id,
      user: {
        id: 'user-123',
      },
    })
  })
})
