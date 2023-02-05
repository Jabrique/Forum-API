class DeleteReplyUseCase {
  constructor({ authenticationTokenManager, replyRepository }) {
    this._authenticationTokenManager = authenticationTokenManager;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam, headerAuthorization) {
    const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuthorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._replyRepository.checkReplyIsExist(useCaseParam);
    await this._replyRepository.verifyReplyAccess({ replyId: useCaseParam.replyId, owner });
    await this._replyRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
