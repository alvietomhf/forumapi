class DeleteReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }

  async execute({
    threadId, commentId, replyId, user,
  }) {
    await this._threadRepository.getThreadById(threadId)
    await this._commentRepository.getCommentById(commentId)
    const reply = await this._replyRepository.getReplyById(replyId)
    await this._replyRepository.deleteReply({ reply, user })
  }
}

module.exports = DeleteReplyUseCase
