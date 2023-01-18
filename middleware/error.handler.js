const { StatusCodes } = require("http-status-codes");


class ErrorHandlerMiddleware {
    constructor() {}

    onError(error, request, response, next) {
        const ErrorObject = {
            statusCode: error.statusCode || 500,
            message: error.message || 'Something Went Wrong'
        };

        response.status(ErrorObject.statusCode).json({ msg: ErrorObject.message });
    }

    routeNotFound(request, response, next) {
        response.status(StatusCodes.NOT_FOUND).json({ msg: 'route not found' });
    }
}



module.exports = new ErrorHandlerMiddleware();