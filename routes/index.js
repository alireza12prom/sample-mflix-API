'use strict';

const { Router } = require('express');
const router = Router();

const { JwtMiddleware } = require('../middleware');

// routes
const moviesRoute = require('./movie.router');
const authenticateUserRout = require('./authenticate.user')
const usersRoute = require('./users.router');

router.use('/api/v1/movies',JwtMiddleware.verify, moviesRoute);
router.use('/auth', authenticateUserRout);
router.use('/users', usersRoute);

module.exports = router;