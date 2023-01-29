class DetailReplies {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      id, comment_Id, content, date, username, isDeleted,
    } = payload;

    this.id = id;
    this.comment_Id = comment_Id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDeleted = isDeleted;
  }

  _validatePayload({
    id, comment_Id, content, date, username, isDeleted,
  }) {
    if (!id || !comment_Id || !content || !date || !username || isDeleted === undefined) {
      throw new Error('DETAIL_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof comment_Id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReplies;
