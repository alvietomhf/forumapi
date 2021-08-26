const DetailThread = require('../DetailThread')

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'my thread',
      body: 'dicoding',
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'my thread',
      body: 'dicoding',
      date: new Date(),
      username: 'vito',
      comments: 1,
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'my thread',
      body: 'dicoding',
      date: new Date(),
      username: 'vito',
      comments: [
        {
          id: 'comment-FBs3OkJBCarHDkv8_1bIE',
          username: 'mita',
          date: new Date(),
          replies: [],
          content: '**komentar telah dihapus**',
        },
      ],
    }

    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread.id).toEqual(payload.id)
    expect(detailThread.body).toEqual(payload.body)
    expect(detailThread.username).toEqual(payload.username)
  })
})
