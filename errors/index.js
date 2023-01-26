const { NotFoundError } = require('./NotFound');
const { BadRequestError } = require('./BadRequest');
const { UnauthorizedError } = require('./Unauthorized');
const { ForbbidenError } = require('./Forbbiden');
const { InternalServerError } = require('./InternalServer');

module.exports = {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbbidenError,
    InternalServerError,
};
