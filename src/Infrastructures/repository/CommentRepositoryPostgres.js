const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment({ newComment, user, threadId }) {
    const { content } = newComment
    const id = `comment-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, user.id, user.username, new Date()],
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    return result.rows[0]
  }

  async deleteComment({
    comment: { id: commentId, owner },
    user: { id: userId },
  }) {
    if (owner !== userId) {
      throw new AuthorizationError('comment bukan milik anda')
    }

    const query = {
      text: 'UPDATE comments SET isdelete = $1 WHERE id = $2',
      values: [true, commentId],
    }

    await this._pool.query(query)
  }

  async getCommentByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE threadid = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = CommentRepositoryPostgres
