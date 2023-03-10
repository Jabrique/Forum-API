const DetailThread = require('../DetailThread');

describe('DetailThread', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'test',
      body: 'mantap',
      date: '2023',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'test',
      body: 'mantap',
      date: '2023',
      username: 'dicoding',
      comments: {},
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'test',
      body: 'mantap',
      date: '2023',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread)
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
