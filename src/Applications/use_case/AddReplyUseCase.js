const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ authenticationTokenManager, commentRepository, replyRepository }) {
    this._authenticationTokenManager = authenticationTokenManager;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParam, headerAuthorization) {
    const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuthorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository.checkCommentIsExist(useCaseParam);
    return await this._replyRepository.addReply(
      new NewReply({ ...useCasePayload, commentId: useCaseParam.commentId, owner }),
    );
  }
}

module.exports = AddReplyUseCase;
