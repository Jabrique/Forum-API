class GetDetailThread {
  constructor({ threadRepository, commentRepository, repliesRepositry }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepositry;
  }

  async execute(useCaseParam) {
    const thread = await this._threadRepository.getThreadById(useCaseParam);
    const comments = await this._commentRepository.getAllCommentByThreadId(useCaseParam);
    
  }
}

module.exports = GetDetailThread;
