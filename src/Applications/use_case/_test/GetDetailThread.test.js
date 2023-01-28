const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const GetDetailThread = require('../GetDetailThread');

describe('GetDetailThread', () => {
  it('should orchestrating GetDetailThread action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    const expectedRetrievedThread = new DetailThread({
      id: 'thread-123',
      title: 'mantap',
      body: 'mantapBet',
      date: '2023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'anos',
          date: '2023',
          replies: [
            {
              id: 'reply-123',
              content: 'bakso',
              date: '2023',
              username: 'test123',
            },
          ],
          content: 'venudznor',
        },
      ],
    });

    // mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        id: 'thread-123',
        title: 'mantap',
        body: 'mantapBet',
        date: '2023',
        username: 'dicoding',
        comments: [],
      })));
    mockCommentRepository.getAllCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailComment({
        id: 'comment-123',
        username: 'anos',
        date: '2023',
        replies: [],
        content: 'venudznor',
      })));
    mockRepliesRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailReply({
        id: 'reply-123',
        content: 'bakso',
        date: '2023',
        username: 'test123',
      })));

    // creating use case
    const getDetailThread = new GetDetailThread({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const RetrievedThread = await getDetailThread.execute(useCaseParam);

    // Assert
    expect(RetrievedThread).toStrictEqual(expectedRetrievedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.getAllCommentByThreadId).toBeCalledWith(useCaseParam);
    expect(mockRepliesRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam);
  });
});
