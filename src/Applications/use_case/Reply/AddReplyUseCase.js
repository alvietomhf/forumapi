const NewReply = require('../../../Domains/replies/entities/NewReply')

class AddedReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._replyRepository = replyRepository
  }

  async execute({
    payload, user, threadId, commentId,
  }) {
    const newReply = new NewReply(payload)
    await this._threadRepository.getThreadById(threadId)
    await this._commentRepository.getCommentById(commentId)
    return this._replyRepository.addReply({ newReply, user, commentId })
  }
}

module.exports = AddedReplyUseCase
