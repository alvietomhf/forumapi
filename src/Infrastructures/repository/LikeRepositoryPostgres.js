const AddedComment = require('../../Domains/comments/entities/AddedComment')
const LikeRepository = require('../../Domains/likes/LikeRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async likeComment({ commentId, user: { id: userId } }) {
    const querySelect = {
      text: 'SELECT * FROM likes WHERE commentid = $1 AND owner = $2',
      values: [commentId, userId],
    }
    const { rows } = await this._pool.query(querySelect)

    if (rows.length === 0) {
      const id = `like-${this._idGenerator()}`
      const queryAdd = {
        text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
        values: [id, commentId, userId, true],
      }
      await this._pool.query(queryAdd)
    } else if (rows[0].islike === true) {
      const queryUnlike = {
        text: 'UPDATE likes SET islike = $1 WHERE id = $2',
        values: [false, rows[0].id],
      }
      await this._pool.query(queryUnlike)
    } else {
      const queryLike = {
        text: 'UPDATE likes SET islike = $1 WHERE id = $2',
        values: [true, rows[0].id],
      }
      await this._pool.query(queryLike)
    }
  }

  async getLikeByCommentIds(ids) {
    const likes = []
    for (const id of ids) {
      const query = {
        text: 'SELECT * FROM likes WHERE commentid = $1',
        values: [id],
      }
      /* eslint-disable no-await-in-loop */
      const result = await this._pool.query(query)
      result.rows.forEach((row) => {
        likes.push(row)
      })
    }

    return likes
  }
}

module.exports = LikeRepositoryPostgres
