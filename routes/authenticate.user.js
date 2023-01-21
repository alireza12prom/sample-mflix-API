'use strict';

const { Router } = require('express');
const router = Router();

const { authenticateController } = require('../controller');

router.post('/', authenticateController.authenticate);

module.exports = router;
