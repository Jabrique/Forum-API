const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ authenticationTokenManager, commentRepository, threadRepository }) {
    this._authenticationTokenManager = authenticationTokenManager;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParam, headerAuthorization) {
    const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuthorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._threadRepository.getThreadById(useCaseParam.threadId);
    const newComment = new NewComment({ ...useCasePayload, threadId: useCaseParam.threadId, owner });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
