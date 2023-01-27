'use strict';

const { Tokens } = require('../database');
const {
  ForbbidenError,
  UnauthorizedError,
  BadRequestError,
} = require('../errors');
const { JwtService } = require('../services');

class JwtMiddleware {
  constructor() {}

  verify(request, response, next) {
    const bearer = request.header('Authorization') || '';
    const token = bearer.split(' ')[1];
    const valid = JwtService.verify(token);
    request.user = valid ? JwtService.decode(token) : false;
    return valid ? next() : next(new UnauthorizedError('Token is not valid'));
  }

  hasRole(role) {
    return (request, response, next) => {
      const bearer = request.header('Authorization') || '';
      const token = bearer.split(' ')[1];
      const decoded = JwtService.decode(token);
      const foundRole = decoded.role === role;
      return foundRole ? next() : next(new ForbbidenError('Access Denied'));
    };
  }

  async accessToAuth(request, response, next) {
    const { email } = request.body;

    if (await Tokens.findOne({ email }))
      throw new BadRequestError(`You have already authenticated`);
    next();
  }
}

module.exports = new JwtMiddleware();
