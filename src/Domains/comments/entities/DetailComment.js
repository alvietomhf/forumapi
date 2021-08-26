class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, username, date, content, isdelete } = payload

    this.id = id
    this.username = username
    this.date = date
    this.content = this._showContent({ content, isdelete })
  }

  _verifyPayload({ id, username, date, content, isdelete }) {
    if (!id || !username || !date || !content || isdelete === 'undefined') {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date === 'undefined'
      || typeof content !== 'string'
      || typeof isdelete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  _showContent({ content, isdelete }) {
    return isdelete ? '**komentar telah dihapus**' : content
  }
}

module.exports = DetailComment
