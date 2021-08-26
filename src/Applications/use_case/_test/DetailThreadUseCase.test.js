const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DetailThreadUseCase = require('../DetailThreadUseCase')

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockReplyRepository = new ReplyRepository()
    const thread = {
      id: 'thread-123',
      title: 'thread',
      body: 'my thread',
      username: 'haykal',
      date: new Date()
    }
    const comments = [
      {
        id: 'comment-123',
        threadid: 'thread-123',
        content: 'comment1',
        owner: 'user-234',
        username: 'vito',
        date: new Date(),
        isdelete: false,
      },
      {
        id: 'comment-321',
        threadid: 'thread-123',
        content: 'comment2',
        owner: 'user-345',
        username: 'mita',
        date: new Date(),
        isdelete: true,
      },
    ]
    const replies = [
      {
        id: 'reply-123',
        commentid: 'comment-123',
        content: 'reply1',
        owner: 'user-234',
        username: 'vito',
        date: new Date(),
        isdelete: true,
      },
    ]

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(thread))
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments))
    mockReplyRepository.getReplyByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(replies))

    /** creating use case instance */
    const getDetailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    })

    // Action
    const result = await getDetailThreadUseCase.execute({
      threadId: 'thread-123',
    })

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123')
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      'thread-123',
    )
    expect(mockReplyRepository.getReplyByCommentIds).toBeCalledWith([
      'comment-123',
      'comment-321',
    ])
    expect(result.thread.comments[0].replies).toHaveLength(1)
    expect(result.thread.comments[0].replies[0].id).toEqual('reply-123')
    expect(result.thread.comments[0].replies[0].content).toEqual(
      '**balasan telah dihapus**',
    )
  })
})
