const AddedReply = require('../AddedReply')

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'AddedReply',
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Reply',
      owner: {},
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-h_W1Plfpj0TY7wyT2PUPX',
      content: 'Reply',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }

    // Action
    const addedReply = new AddedReply(payload)

    // Assert
    expect(addedReply.id).toEqual(payload.id)
    expect(addedReply.content).toEqual(payload.content)
    expect(addedReply.owner).toEqual(payload.owner)
  })
})
