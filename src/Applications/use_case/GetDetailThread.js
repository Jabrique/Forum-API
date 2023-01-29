class GetDetailThread {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCaseParam) {
    const thread = await this._threadRepository.getThreadById(useCaseParam);
    const threadComments = await this._commentRepository.getAllCommentByThreadId(useCaseParam);
    const threadReplies = await this._repliesRepository.getRepliesByThreadId(useCaseParam);
    this._filterDeletedComment(threadComments);
    this._filterDeletedReplies(threadReplies);
    this._addRepliesToComment(threadComments, threadReplies);
    thread.comments = threadComments;
    return thread;
  }

  _filterDeletedComment(comments) {
    comments.forEach((comment) => {
      comment.content = comment.isDeleted ? '**komentar telah dihapus**' : comment.content;
      delete comment.isDeleted;
    });
  }

  _filterDeletedReplies(replies) {
    replies.forEach((reply) => {
      reply.content = reply.isDeleted ? '**komentar telah dihapus' : reply.content;
      delete reply.isDeleted;
    });
  }

  _addRepliesToComment(threadComments, threadReplies) {
    threadComments.forEach((comment) => {
      comment.replies = [];
      threadReplies.forEach((reply) => {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      });
    });
  }
}

module.exports = GetDetailThread;
