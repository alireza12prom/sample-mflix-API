const { StatusCodes } = require('http-status-codes');
const { CustomAPIErrors } = require('./custom');

class InternalServerError extends CustomAPIErrors {
    constructor(message) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    InternalServerError,
};
