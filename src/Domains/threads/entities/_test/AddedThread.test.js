const AddedThread = require('../AddedThread')

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Thread',
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Thread',
      owner: {},
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    )
  })

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'Thread',
      owner: 'user-DWrT3pXe1hccYkV1eIAxS',
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
