class LikeCommentUseCase {
  constructor({ commentRepository, threadRepository, likeRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._likeRepository = likeRepository
  }

  async execute({
    threadId, commentId, user,
  }) {
    await this._threadRepository.getThreadById(threadId)
    await this._commentRepository.getCommentById(commentId)
    await this._likeRepository.likeComment({ commentId, user })
  }
}

module.exports = LikeCommentUseCase
