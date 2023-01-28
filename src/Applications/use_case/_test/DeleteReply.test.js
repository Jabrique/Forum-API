const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ReplyRepository = require('../../../Domains/replies/RepliesRepository');
const DeleteReplyUseCase = require('../DeleteReply');

describe('DeleteReply', () => {
  it('should orchestrating delete reply action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const headerAuthorization = 'Bearer Token';
    const accessToken = 'Token';

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockReplyRepository = new ReplyRepository();

    // mocking
    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve('Token'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));
    mockReplyRepository.checkReplyIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    // creating use case
    const deleteReplyUseCase = new DeleteReplyUseCase({
      authenticationTokenManager: mockAuthenticationTokenManager,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseParam, headerAuthorization);

    // Assert
    expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockReplyRepository.checkReplyIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.verifyReplyAccess).toBeCalledWith({ replyId: useCaseParam.replyId, owner: 'user-123' });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParam.replyId);
  });
});
