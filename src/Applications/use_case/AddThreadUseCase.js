const NewThread = require('../../Domains/threads/entities/NewThread')

class AddedThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute({ payload, user }) {
    const newThread = new NewThread(payload)
    return this._threadRepository.addThread({ newThread, user })
  }
}

module.exports = AddedThreadUseCase
