const AddedReplies = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/RepliesRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class RepliesRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addReply({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();

    const result = await this._pool.query({
      text: 'INSERT INTO replies VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, date],
    });

    return new AddedReplies({ ...result.rows[0] });
  }

  async verifyReplyAccess({ replyId, owner }) {
    const result = await this._pool.query({
      text: 'SELECT 1 FROM replies WHERE id=$1 AND owner=$2',
      values: [replyId, owner],
    });
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses reply ini');
    }
  }

  async getRepliesByThreadId(threadId) {
    const result = await this._pool.query({
      text: `SELECT replies.id, replies.content, replies.date, replies.is_Deleted, comments.id as comment_Id, users.username
      FROM replies
      INNER JOIN comments ON replies.comment_id=comments.id
      INNER JOIN users ON replies.owner=users.id
      WHERE comments.thread_id=$1
      ORDER BY date ASC`,
      values: [threadId],
    });
    return result.rows;
  }
}

module.exports = RepliesRepositoryPostgres;
