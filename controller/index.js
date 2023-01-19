'use strict';

const movieController = require('./movies.controller');
const authenticateController = require('./authenticate.controller');
const usersController = require('./users.controller');
const registerController = require('./register.controller');

module.exports = {
    movieController,
    authenticateController,
    usersController,
    registerController
}