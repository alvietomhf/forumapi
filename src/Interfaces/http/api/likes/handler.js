class LikesHandler {
  constructor({ likeCommentUseCase }) {
    this._likeCommentUseCase = likeCommentUseCase

    this.likeCommentHandler = this.likeCommentHandler.bind(this)
  }

  async likeCommentHandler({
    auth: {
      credentials: { user },
    },
    params: { threadId, commentId },
  }) {
    await this._likeCommentUseCase.execute({ threadId, commentId, user })
    return {
      status: 'success',
    }
  }
}

module.exports = LikesHandler
