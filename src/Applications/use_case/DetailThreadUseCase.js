const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')
const DetailThread = require('../../Domains/threads/entities/DetailThread')

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute({ threadId }) {
    const { id, title, body, date, username } = await this._threadRepository.getThreadById(threadId)
    const arrComment = await this._commentRepository.getCommentByThreadId(threadId)
    const commentIds = arrComment.map((comment) => comment.id)
    const replies = await this._replyRepository.getReplyByCommentIds(commentIds)

    const comments = []
    const sortedComment = this._sortData(arrComment).map(({ id, username, date, content, isdelete }) => new DetailComment({ id, username, date: new Date(date), content, isdelete }))

    sortedComment.forEach((comment) => {
      const filteredReply = replies.filter((reply) => reply.commentid === comment.id)
      const dataReply = this._sortData(filteredReply).map(({ id, username, date, content, isdelete }) => new DetailReply({ id, username, date: new Date(date), content, isdelete }))
      comments.push({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: dataReply,
        content: comment.content,
      })
    })

    return { thread: new DetailThread({ id, title, body, date: new Date(date), username, comments }) }
  }

  _sortData(arrData) {
    return arrData.sort((a, b) => new Date(a.date) - new Date(b.date))
  }
}

module.exports = DetailThreadUseCase
