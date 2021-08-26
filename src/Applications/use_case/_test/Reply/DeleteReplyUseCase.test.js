const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository')
const DeleteReplyUseCase = require('../../Reply/DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const reply = {
      id: 'reply-h_W1Plfpj0TY7wyT2PUPX',
      owner: 'user-123',
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(reply))
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ reply, user: { id: 'user-123' } }))

    const getReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })

    // Act
    await getReplyUseCase.execute({
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      commentId: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      replyId: reply.id,
      user: { id: 'user-123' },
    })

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      'thread-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      'comment-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockReplyRepository.getReplyById).toBeCalledWith(
      'reply-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockReplyRepository.deleteReply).toBeCalledWith({
      reply,
      user: {
        id: 'user-123',
      },
    })
  })
})
