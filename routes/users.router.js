'use strict';

const { Router } = require('express');
const router = Router();

const { usersController } = require('../controller');
const {
  validateParamsMiddleware,
  JwtMiddleware,
  validateBodyMiddleware,
} = require('../middleware');

router.use(JwtMiddleware.hasRole('ADMIN'));

router
  .route('/')
  .get(usersController.all)
  .post(
    validateBodyMiddleware.validateBodyOnCreateUser,
    usersController.create
  );

router
  .route('/:userId')
  .head(usersController.exists)
  .get(usersController.find)
  .put(validateBodyMiddleware.validateBodyOnCreateUser, usersController.replace)
  .patch(
    validateBodyMiddleware.validateBodyOnUpdateUser,
    usersController.update
  )
  .delete(usersController.delete);

router.param('userId', validateParamsMiddleware.validateObjectId);
module.exports = router;
