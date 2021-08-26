const NewReply = require('../../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../../Domains/replies/entities/AddedReply')
const CommentRepository = require('../../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository')
const AddReplyUseCase = require('../../Reply/AddReplyUseCase')

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'First reply',
    }
    const user = {
      id: 'user-DWrT3pXe1hccYkV1eIAxS',
      username: 'vito',
    }
    const newReply = new AddedReply({
      id: 'reply-h_W1Plfpj0TY7wyT2PUPX',
      content: payload.content,
      owner: user.id,
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(newReply))

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    })

    // Action
    const addedReply = await getReplyUseCase.execute({
      payload,
      user,
      threadId: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      commentId: 'comment-123',
    })

    // Assert
    expect(addedReply).toStrictEqual(newReply)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      'thread-h_W1Plfpj0TY7wyT2PUPX',
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith('comment-123')
    expect(mockReplyRepository.addReply).toBeCalledWith({
      newReply: new NewReply({
        content: payload.content,
      }),
      user,
      commentId: 'comment-123',
    })
  })
})
