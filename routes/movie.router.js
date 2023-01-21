'use strict';

const { Router } = require('express');
const router = Router();

const { movieController } = require('../controller');
const {
    validateQueriesMiddleware,
    validateParamsMiddleware,
} = require('../middleware');

router.route('/').get(validateQueriesMiddleware, movieController.getAllMovies);

router.route('/:movieId').get(movieController.getSingleMovie);

router
    .route('/:movieId/like')
    .post(movieController.likeMovie)
    .delete(movieController.unlikeMovie);

router
    .route('/:movieId/comment')
    .post(movieController.postComment)
    .delete(movieController.deleteComment);

router.param('movieId', validateParamsMiddleware.validateObjectId);
module.exports = router;
