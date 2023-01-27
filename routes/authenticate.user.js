'use strict';

const { Router } = require('express');
const router = Router();

const { authenticateController } = require('../controller');
const { validateBodyMiddleware } = require('../middleware');
const jwtMiddleware = require('../middleware/jwt.middleware');

router.post(
  '/',
  validateBodyMiddleware.validateBodyOnAuthenticationUser,
  jwtMiddleware.accessToAuth,
  authenticateController.authenticate
);

module.exports = router;
