const NewReply = require('../NewReply')

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'abc',
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'First Reply',
    }

    // Action
    const { content } = new NewReply(payload)

    // Assert
    expect(content).toEqual(payload.content)
  })
})
