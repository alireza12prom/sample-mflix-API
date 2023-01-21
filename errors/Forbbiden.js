const { StatusCodes } = require('http-status-codes');
const { CustomAPIErrors } = require('./custom');

class ForbbidenError extends CustomAPIErrors {
    constructor(message) {
        super(message, StatusCodes.FORBIDDEN);
    }
}

module.exports = {
    ForbbidenError,
};
