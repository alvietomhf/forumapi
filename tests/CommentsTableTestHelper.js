/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-h_W1Plfpj0TY7wyT2PUPP',
    threadId = 'thread-h_W1Plfpj0TY7wyT2PUPP',
    content = 'first comment',
    owner = 'user-DWrT3pXe1hccYkV1eIAxX',
    username = 'vito',
    date = new Date(),
    isdelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, threadId, content, owner, username, date, isdelete],
    }

    await pool.query(query)
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async findCommentByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE threadid = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1')
  },
}

module.exports = CommentsTableTestHelper
