const { Movies, Comments, Likes } = require('../database');
const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
// FIXME: lastUpdate does not update when update a document

const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require('../errors');

const {
  MovieNotFoundError,
  AlreadyExistsError,
  CommentNotFoundError,
  LikeNotFoundError,
} = require('../database/error');

class MovieContorller {
  constructor() {}
  /**
   *  Pagination queries:
   *      page, pre_page, rel
   *  Filter queries:
   *      lan, gen, year, cnt
   *  Search query:`
   *      q
   */
  async getAllMovies(request, response) {
    try {
      const movies = await Movies.getAllMovies(request.query);

      response.status(StatusCodes.OK);
      response.json({ movies, n: movies.length });
    } catch (error) {
      if (error instanceof MovieNotFoundError)
        throw new NotFoundError('Movie Not Found');
      else throw new InternalServerError('Database error occurred');
    }
  }

  async getSingleMovie(request, response) {
    const { movieId } = request.params;

    try {
      const movie = await Movies.getSingleMovie(movieId);

      response.status(StatusCodes.OK);
      response.json({ movie });
    } catch (error) {
      if (error instanceof MovieNotFoundError)
        throw new BadRequestError('Movie not found');
      else throw new InternalServerError('Database error occurred');
    }
  }

  async likeMovie(request, response) {
    const {
      user: { sub },
      params: { movieId },
    } = request;

    try {
      await Movies.likeMovie(new ObjectId(sub), new ObjectId(movieId));

      response.status(StatusCodes.OK);
      response.json({ msg: `OK` });
    } catch (error) {
      if (error instanceof AlreadyExistsError)
        throw new BadRequestError('You have already liked this movie');
      else if (error instanceof MovieNotFoundError)
        throw new BadRequestError('Movie not found');
      else throw new InternalServerError(`Database occurred error`);
    }
  }

  async unlikeMovie(request, response) {
    const {
      user: { sub },
      params: { movieId },
    } = request;

    try {
      await Movies.unlikeMovie(new ObjectId(sub), new ObjectId(movieId));

      response.status(StatusCodes.OK);
      response.json({ msg: 'OK' });
    } catch (error) {
      if (error instanceof LikeNotFoundError)
        throw new InternalServerError(`You haven't like this movie`);
      else if (error instanceof MovieNotFoundError)
        throw new BadRequestError(`Movie not found`);
      else throw new InternalServerError(`Database occurred error`);
    }
  }

  async postComment(request, response) {
    const {
      user: { name, email },
      params: { movieId },
      body: { text },
    } = request;

    try {
      await Movies.postComment(new ObjectId(movieId), name, email, text);

      response.status(StatusCodes.OK);
      response.json({ msg: `OK` });
    } catch (error) {
      // console.log(error);
      if (error instanceof MovieNotFoundError)
        throw new BadRequestError('movie not found');
      else if (error instanceof AlreadyExistsError)
        throw new BadRequestError(
          'You have already posted comment for this movie'
        );
      else throw new InternalServerError(`Database occurred error`);
    }
  }

  async deleteComment(request, response) {
    const {
      user: { email },
      params: { movieId },
    } = request;

    try {
      await Movies.deleteComment(email, new ObjectId(movieId));

      response.status(StatusCodes.OK);
      response.json({ msg: `OK` });
    } catch (error) {
      if (error instanceof CommentNotFoundError)
        throw new BadRequestError(`You haven't posted comment`);
      else if (error instanceof MovieNotFoundError)
        throw new BadRequestError(`Movie not found`);
      else throw new InternalServerError(`Database occurred error`);
    }
  }

  async editComment(request, response) {
    const {
      user: { email },
      params: { movieId },
      body: { text },
    } = request;

    try {
      await Movies.editComment(text, email, new ObjectId(movieId));

      response.status(StatusCodes.OK);
      response.json({ msg: 'OK' });
    } catch (error) {
      console.log(error);
      if (error instanceof CommentNotFoundError)
        throw new BadRequestError(`You haven't any comment for edit`);
      else throw new InternalServerError(`Database occurred error`);
    }
  }
}

module.exports = new MovieContorller();
