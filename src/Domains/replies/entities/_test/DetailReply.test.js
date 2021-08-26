const DetailReply = require('../DetailReply')

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user',
      content: 'dicoding',
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this reply',
      isdelete: 1,
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this content',
      isdelete: true,
    }

    const payload2 = {
      id: 'reply-FBs3OkJBCarHDkv8_1bIE',
      username: 'mita',
      date: new Date(),
      content: 'this content',
      isdelete: false,
    }

    // Action
    const detailReply = new DetailReply(payload)
    const detailReply2 = new DetailReply(payload2)

    // Assert
    expect(detailReply.id).toEqual(payload.id)
    expect(detailReply.content).toEqual('**balasan telah dihapus**')
    expect(detailReply2.content).toEqual(payload2.content)
    expect(detailReply.username).toEqual(payload.username)
  })
})
