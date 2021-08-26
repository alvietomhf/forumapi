class CommentsHandler {
  constructor({ addCommentUseCase, deleteCommentUseCase }) {
    this._addCommentUseCase = addCommentUseCase
    this._deleteCommentUseCase = deleteCommentUseCase

    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }

  async postCommentHandler(
    {
      payload,
      auth: {
        credentials: { user },
      },
      params: { threadId },
    },
    h,
  ) {
    const addedComment = await this._addCommentUseCase.execute({
      payload,
      user,
      threadId,
    })

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler({
    auth: {
      credentials: { user },
    },
    params: { threadId, commentId },
  }) {
    await this._deleteCommentUseCase.execute({ threadId, commentId, user })
    return {
      status: 'success',
    }
  }
}

module.exports = CommentsHandler
