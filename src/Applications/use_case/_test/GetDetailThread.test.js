const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const GetDetailThread = require('../GetDetailThread');

describe('GetDetailThread', () => {
  it('should orchestrating GetDetailThread action correctly', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    const expectedRetrievedThread = {
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
    };

    // mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'mantap',
        body: 'mantapBet',
        date: '2023',
        username: 'dicoding',
        comments: [],
      }));
    mockCommentRepository.getAllCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        username: 'anos',
        date: '2023',
        replies: [],
        content: 'venudznor',
        isDeleted: false,
      }]));
    mockRepliesRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'bakso',
        date: '2023',
        username: 'test123',
        isDeleted: false,
      }]));

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

  it('should change the content comment and reply when isDeleted true', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    const expectedRetrievedThread = {
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
              content: '**komentar telah dihapus**',
              date: '2023',
              username: 'test123',
            },
          ],
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'mantap',
        body: 'mantapBet',
        date: '2023',
        username: 'dicoding',
        comments: [],
      }));
    mockCommentRepository.getAllCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        username: 'anos',
        date: '2023',
        replies: [],
        content: 'venudznor',
        isDeleted: true,
      }]));
    mockRepliesRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'bakso',
        date: '2023',
        username: 'test123',
        isDeleted: true,
      }]));

    const getDetailThread = new GetDetailThread({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const RetrivedThread = await getDetailThread.execute(useCaseParam);

    // Assert
    expect(RetrivedThread).toStrictEqual(expectedRetrievedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.getAllCommentByThreadId).toBeCalledWith(useCaseParam);
    expect(mockRepliesRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam);
  });

  it('should push only matched reply commentId', async () => {
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    const expectedRetrievedThread = {
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
              id: 'reply-777',
              content: '**komentar telah dihapus**',
              date: '2023',
              username: 'enak',
            },
          ],
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'mantap',
        body: 'mantapBet',
        date: '2023',
        username: 'dicoding',
        comments: [],
      }));
    mockCommentRepository.getAllCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        username: 'anos',
        date: '2023',
        replies: [],
        content: 'venudznor',
        isDeleted: true,
      }]));
    mockRepliesRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        commentId: 'comment-x',
        content: 'bakso',
        date: '2023',
        username: 'test123',
        isDeleted: true,
      },
      {
        id: 'reply-777',
        commentId: 'comment-123',
        content: 'soto',
        date: '2023',
        username: 'enak',
        isDeleted: true,
      },
      ]));

    const getDetailThread = new GetDetailThread({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const RetrivedThread = await getDetailThread.execute(useCaseParam);

    // Assert
    expect(RetrivedThread).toStrictEqual(expectedRetrievedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam);
    expect(mockCommentRepository.getAllCommentByThreadId).toBeCalledWith(useCaseParam);
    expect(mockRepliesRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam);
  });
});
