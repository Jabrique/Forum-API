const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('addComment', () => {
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'baksoEnak',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'baksoEnak',
      owner: 'user-12345',
    });
    const headerAuthorization = 'Bearer token';
    const accessToken = 'token';

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve('token'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-12345' }));
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'baksoEnak',
        owner: 'user-12345',
      })));

    const addCommentUseCase = new AddCommentUseCase({
      authenticationTokenManager: mockAuthenticationTokenManager,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase
      .execute(useCasePayload, useCaseParam, headerAuthorization);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCaseParam.threadId,
      owner: expectedAddedComment.owner,
    }));
  });
});
