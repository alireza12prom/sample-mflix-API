const { StatusCodes } = require('http-status-codes');
const { CustomAPIErrors } = require('./custom');

class NotFoundError extends CustomAPIErrors {
    constructor(message) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

module.exports = {
    NotFoundError,
};
