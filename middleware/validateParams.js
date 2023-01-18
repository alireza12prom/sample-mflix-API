const { ObjectId } = require("mongodb");
const { BadRequestError } = require("../errors");

class Middleware {
    constructor() {}

    validateObjectId(request, response, next) {
        const { movieId, userId } = request.params;

        if (!ObjectId.isValid(movieId) && !ObjectId.isValid(userId)) {
            throw new BadRequestError('Id is not valid');
        }

        if (movieId) request.params.movieId = new ObjectId(movieId);
        else request.params.userId = new ObjectId(userId);
        next();
    }
}

module.exports = new Middleware();