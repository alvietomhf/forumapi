class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute({
    threadId, commentId, user,
  }) {
    await this._threadRepository.getThreadById(threadId)
    const comment = await this._commentRepository.getCommentById(commentId)
    await this._commentRepository.deleteComment({ comment, user })
  }
}

module.exports = DeleteCommentUseCase
