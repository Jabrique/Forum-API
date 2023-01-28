const DetailComment = require('../DetailComment');

describe('DetailComment', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2023',
      replies: [],
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2023',
      replies: true,
      content: 'test',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2023',
      replies: [],
      content: 'test',
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.content).toEqual(payload.content);
  });
});
