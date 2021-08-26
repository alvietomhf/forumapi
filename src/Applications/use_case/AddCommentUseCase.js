const NewComment = require('../../Domains/comments/entities/NewComment')

class AddedCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute({ payload, user, threadId }) {
    const newComment = new NewComment(payload)
    await this._threadRepository.getThreadById(threadId)
    return this._commentRepository.addComment({ newComment, user, threadId })
  }
}

module.exports = AddedCommentUseCase
