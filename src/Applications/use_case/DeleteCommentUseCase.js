class DeleteCommentUseCase {
  constructor({ authenticationTokenManager, commentRepository }) {
    this._authenticationTokenManager = authenticationTokenManager;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, headerAuthorization) {
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(headerAuthorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository
      .checkCommentIsExist(useCasePayload);
    await this._commentRepository
      .verifyCommentAccess({ commentId: useCasePayload.commentId, owner });
    await this._commentRepository
      .deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
