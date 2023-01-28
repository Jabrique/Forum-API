const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      treadId: 'thread-123',
      commentId: 'comment-123',
    };
    const headerAuthorization = 'Bearer Token';
    const accessToken = 'Token';

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('Token'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository
      .verifyCommentAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    // Action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      authenticationTokenManager: mockAuthenticationTokenManager,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload, headerAuthorization);

    // Assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith({ ...useCasePayload });
    expect(mockCommentRepository.verifyCommentAccess)
      .toBeCalledWith({ commentId: useCasePayload.commentId, owner: 'user-123' });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
  });
});
