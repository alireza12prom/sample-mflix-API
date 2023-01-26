'use strict';

const errorHandlerMiddleware = require('./error.handler');
const validateQueriesMiddleware = require('./validateQuery');
const validateParamsMiddleware = require('./validateParams');
const JwtMiddleware = require('./jwt.middleware');
const validateBodyMiddleware = require('./validateBody');

module.exports = {
  errorHandlerMiddleware,
  validateQueriesMiddleware,
  validateParamsMiddleware,
  JwtMiddleware,
  validateBodyMiddleware,
};
