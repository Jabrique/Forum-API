class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      id, username, date, replies, content, isDeleted,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = content;
    this.isDeleted = isDeleted;
  }

  _validatePayload({
    id, username, date, replies, content, isDeleted,
  }) {
    if (!id || !username || !date || !replies || !content || isDeleted === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || !Array.isArray(replies) || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
