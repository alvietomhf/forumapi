class RepliesHandler {
  constructor({ addReplyUseCase, deleteReplyUseCase }) {
    this._addReplyUseCase = addReplyUseCase
    this._deleteReplyUseCase = deleteReplyUseCase

    this.postReplyHandler = this.postReplyHandler.bind(this)
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
  }

  async postReplyHandler(
    {
      payload,
      auth: {
        credentials: { user },
      },
      params: { threadId, commentId },
    },
    h,
  ) {
    const addedReply = await this._addReplyUseCase.execute({
      payload,
      user,
      threadId,
      commentId,
    })

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler({
    auth: {
      credentials: { user },
    },
    params: { threadId, commentId, replyId },
  }) {
    await this._deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      user,
    })
    return {
      status: 'success',
    }
  }
}

module.exports = RepliesHandler
