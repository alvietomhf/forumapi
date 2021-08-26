const AddedReply = require('../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply({ newReply, user, commentId }) {
    const { content } = newReply
    const id = `reply-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, content, user.id, user.username, new Date()],
    }

    const result = await this._pool.query(query)

    return new AddedReply({ ...result.rows[0] })
  }

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan')
    }

    return result.rows[0]
  }

  async deleteReply({ reply: { id: replyId, owner }, user: { id: userId } }) {
    if (owner !== userId) {
      throw new AuthorizationError('reply bukan milik anda')
    }

    const query = {
      text: 'UPDATE replies SET isdelete = $1 WHERE id = $2',
      values: [true, replyId],
    }

    await this._pool.query(query)
  }

  async getReplyByCommentIds(ids) {
    const replies = []
    for (const id of ids) {
      const query = {
        text: 'SELECT * FROM replies WHERE commentid = $1',
        values: [id],
      }
      /* eslint-disable no-await-in-loop */
      const result = await this._pool.query(query)
      result.rows.forEach((row) => {
        replies.push(row)
      })
    }

    return replies
  }
}

module.exports = ReplyRepositoryPostgres
