const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const AddedReplies = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      username: 'anos',
      password: 'secret',
      fullname: 'anos voldigoad',
    });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ commentId: 'comment-123' });
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply to database', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'kuat',
        owner: 'user-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => '2023';
      }

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedReply = await repliesRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(addedReply).toStrictEqual(new AddedReplies({
        id: 'reply-123',
        content: 'kuat',
        owner: 'user-123',
      }));
      expect(reply).toBeDefined();
    });
  });

  describe('verifyReplyAccess function', () => {
    it('should throw error if access not granted', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});

      // Assert
      await expect(repliesRepositoryPostgres.verifyReplyAccess({
        owner: 'user-x',
        replyId: 'reply-123',
      })).rejects.toThrowError('anda tidak berhak mengakses reply ini');
    });

    it('should grant access correctly', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {}, {});

      await RepliesTableTestHelper.addReply({});

      await expect(repliesRepositoryPostgres.verifyReplyAccess({
        owner: 'user-123',
        replyId: 'reply-123',
      })).resolves.toBeUndefined()
    });
  });

  describe('getRepliesByThreadId', ()=>{
    it('should return all replies on thread', async()=>{
      
    })
  })
});