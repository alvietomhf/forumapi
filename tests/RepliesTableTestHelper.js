/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-h_W1Plfpj0TY7wyT2PUPP',
    commentId = 'comment-h_W1Plfpj0TY7wyT2PUPP',
    content = 'first reply',
    owner = 'user-DWrT3pXe1hccYkV1eIAxX',
    username = 'vito',
    date = new Date(),
    isdelete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, commentId, content, owner, username, date, isdelete],
    }

    await pool.query(query)
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async findReplyByCommentsId(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE commentid = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1')
  },
}

module.exports = RepliesTableTestHelper
