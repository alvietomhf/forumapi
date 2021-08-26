const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')

class DetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._likeRepository = likeRepository
  }

  async execute({ threadId }) {
    const {
      id: idThread, title, body, date: dateThread, username: usernameThread,
    } = await this._threadRepository.getThreadById(threadId)
    const arrComment = await this._commentRepository.getCommentByThreadId(threadId)
    const commentIds = arrComment.map((comment) => comment.id)
    const replies = await this._replyRepository.getReplyByCommentIds(commentIds)
    const likes = await this._likeRepository.getLikeByCommentIds(commentIds)

    const comments = []
    const sortedComment = this._sortData(arrComment).map(({
      id, username, date, content, isdelete,
    }) => new DetailComment({
      id, username, date: new Date(date), content, isdelete,
    }))

    sortedComment.forEach((comment) => {
      const likeCount = likes
        .filter((like) => like.commentid === comment.id && like.islike === true)
      const filteredReply = replies.filter((reply) => reply.commentid === comment.id)
      const dataReply = this._sortData(filteredReply).map(({
        id, username, date, content, isdelete,
      }) => new DetailReply({
        id, username, date: new Date(date), content, isdelete,
      }))
      comments.push({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: dataReply,
        content: comment.content,
        likeCount: likeCount.length,
      })
    })

    return {
      thread: new DetailThread({
        id: idThread, title, body, date: new Date(dateThread), username: usernameThread, comments,
      }),
    }
  }

  _sortData(arrData) {
    return arrData.sort((a, b) => new Date(a.date) - new Date(b.date))
  }
}

module.exports = DetailThreadUseCase
