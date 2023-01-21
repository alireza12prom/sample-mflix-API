const { StatusCodes } = require('http-status-codes');
const { CustomAPIErrors } = require('./custom');

class BadRequestError extends CustomAPIErrors {
    constructor(message) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

module.exports = { BadRequestError };
