const AddedComment = require('../AddedComment')

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'AddedComment',
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Comment',
      owner: {},
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-h_W1Plfpj0TY7wyT2PUPX',
      content: 'Comment',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
