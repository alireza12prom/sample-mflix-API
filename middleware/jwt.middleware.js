'use strict';

const { ForbbidenError, UnauthorizedError } = require('../errors');
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
}

module.exports = new JwtMiddleware();
