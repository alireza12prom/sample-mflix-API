'use strict';

const { Router } = require('express');
const router = Router();

const { registerController } = require('../controller');
const { validateBodyMiddleware } = require('../middleware');

router
  .route('/')
  .post(
    validateBodyMiddleware.validateBodyOnRegisterUser,
    registerController.register
  );

module.exports = router;
