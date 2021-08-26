const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user',
      content: 'dicoding',
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this content',
      isdelete: 1
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this content',
      isdelete: true
    }
    const payload2 = {
      id: 'comment-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this content',
      isdelete: false
    }

    // Action
    const detailComment = new DetailComment(payload)
    const detailComment2 = new DetailComment(payload2)

    // Assert
    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.content).toEqual('**komentar telah dihapus**')
    expect(detailComment2.content).toEqual(payload2.content)
    expect(detailComment.username).toEqual(payload.username)
  })
})
