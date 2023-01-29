const DetailReply = require('../DetailReply');

describe('DetailReply', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      id: 'Replies-123',
      comment_Id: 'comment-123',
      content: 'mantap',
      date: '2023',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      id: 'Replies-123',
      comment_Id: 'comment-123',
      content: 'mantap',
      date: '2023',
      username: 'test',
      isDeleted: {},
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReplies object correctly', () => {
    const payload = {
      id: 'Replies-123',
      comment_Id: 'comment-123',
      content: 'mantap',
      date: '2023',
      username: 'dicoding',
      isDeleted: false,
    };

    // Action
    const detailReplies = new DetailReply(payload);

    // Assert
    expect(detailReplies).toBeInstanceOf(DetailReply);
    expect(detailReplies.id).toEqual(payload.id);
    expect(detailReplies.content).toEqual(payload.content);
    expect(detailReplies.date).toEqual(payload.date);
    expect(detailReplies.username).toEqual(payload.username);
    expect(detailReplies.isDeleted).toEqual(payload.isDeleted);
  });
});
