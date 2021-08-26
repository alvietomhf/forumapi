class ThreadsHandler {
  constructor({ addThreadUseCase, detailThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase
    this._detailThreadUseCase = detailThreadUseCase

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.showThreadHandler = this.showThreadHandler.bind(this)
  }

  async postThreadHandler(
    {
      payload,
      auth: {
        credentials: { user },
      },
    },
    h
  ) {
    const addedThread = await this._addThreadUseCase.execute({ payload, user })

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    })
    response.code(201)
    return response
  }

  async showThreadHandler({ params: { threadId } }, h) {
    const thread = await this._detailThreadUseCase.execute({ threadId })

    const response = h.response({
      status: 'success',
      data: thread,
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
