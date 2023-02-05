const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addRepliesUseCase = this._container.getInstance(AddReplyUseCase.name);
    const headerAuthorization = request.headers.authorization;
    const addedReply = await addRepliesUseCase
      .execute(request.payload, request.params, headerAuthorization);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const headerAuthorization = request.headers.authorization;
    await deleteReplyUseCase.execute(request.params, headerAuthorization);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
