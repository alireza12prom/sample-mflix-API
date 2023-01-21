const { StatusCodes } = require('http-status-codes');
const { CustomAPIErrors } = require('./custom');

class UnauthorizedError extends CustomAPIErrors {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

module.exports = {
    UnauthorizedError,
};
