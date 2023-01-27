'use strict';

const { Router } = require('express');
const router = Router();

const { authenticateController } = require('../controller');
const { validateBodyMiddleware } = require('../middleware');

router.post(
  '/',
  validateBodyMiddleware.validateBodyOnAuthenticationUser,
  authenticateController.authenticate
);

module.exports = router;
