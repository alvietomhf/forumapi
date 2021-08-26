/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async addLike({
    id = 'like-h_W1Plfpj0TY7wyT2PUPP',
    commentId = 'comment-h_W1Plfpj0TY7wyT2PUPP',
    owner = 'user-DWrT3pXe1hccYkV1eIAxX',
    islike = true,
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, commentId, owner, islike],
    }
    await pool.query(query)
  },

  async findLike(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE commentid = $1 AND owner = $2',
      values: [commentId, userId],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1')
  },
}

module.exports = LikesTableTestHelper
