const { Movies, Comments, Likes, Users, client } = require('../database');
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
    let { page, per_page, rel } = request.query;
    let Projection = {
      tomatoes: 0,
      awards: 0,
      fullplot: 0,
      poster: 0,
      lastupdated: 0,
    };

    // pagination
    let Sorts = {};
    let skip, limit;
    switch (rel) {
      case 'first':
        skip = 0;
        limit = (page + 1) * per_page;
        break;
      case 'last':
        skip = 0;
        limit = (page + 1) * per_page;
        Sorts.$natural = -1;
        break;
      default:
        skip = page * per_page;
        limit = per_page;
    }

    // Filtering
    let Filters = {};
    let { languages, genres, year, countries, q } = request.query;

    if (q) Filters.$text = { $search: `"${q}"` };
    if (languages) Filters.languages = languages;
    if (genres) Filters.genres = genres;
    if (countries) Filters.countries = countries;
    if (year) Filters.year = year;

    console.log('*** Filter: ', Filters, ' ***');

    let movies = await Movies.find({ ...Filters })
      .sort(Sorts)
      .project(Projection)
      .skip(skip)
      .limit(limit)
      .toArray();

    if (!movies.length) throw new NotFoundError('Movie Not Founded');
    response.status(StatusCodes.OK).json({ movies, n: movies.length });
  }

  async getSingleMovie(request, response) {
    const { movieId } = request.params;

    // FIXME: comments does not returned
    const [movie] = await Promise.all([
      Movies.findOne(
        { _id: movieId },
        { lastupdated: 0, tomatoes: 0, poster: 0 }
      ),
    ]);

    if (!movie) throw new NotFoundError('Movie not found');

    response.status(StatusCodes.OK);
    response.json({
      ...movie,
    });
  }

  async likeMovie(request, response) {
    const {
      user: { sub, name },
      params: { movieId },
    } = request;

    try {
      await Likes.likeMovie(new ObjectId(sub), new ObjectId(movieId));

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
      await Likes.unlikeMovie(new ObjectId(sub), new ObjectId(movieId));

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
      await Comments.postComment(new ObjectId(movieId), name, email, text);

      response.status(StatusCodes.OK);
      response.json({ msg: `OK` });
    } catch (error) {
      if (error instanceof MovieNotFoundError)
        throw new BadRequestError('movie not found');
      else if (error instanceof AlreadyExistsError)
        throw new BadRequestError('You have already posted comment');
      else throw new InternalServerError(`Database occurred error`);
    }
  }

  async deleteComment(request, response) {
    const {
      user: { email },
      params: { movieId },
    } = request;

    try {
      await Comments.deleteComment(email, new ObjectId(movieId));

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
}

module.exports = new MovieContorller();
