const { Movies, Comments, Likes } = require('../database');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const { ObjectId } = require('mongodb');

class MovieContorller {
    constructor() {}
    /**
     *  Pagination queries:
     *      page, pre_page, rel
     *
     *  lan: language
     *  gen: genres,
     *  year: year
     *  countries:countries
     *  type: type,
     *  dir: directors
     *  q: search by title and fullplot
     */
    async getAllMovies(request, response) {
        let { page, per_page, rel } = request.query;
        let Sorts = { $natural: 1 };
        let Projection = {
            tomatoes: 0,
            awards: 0,
            fullplot: 0,
            poster: 0,
            lastupdated: 0,
            comments: 0,
        };

        // pagination
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
            case 'next':
                skip = (page + 1) * per_page;
                limit = per_page;
                break;
            case 'prev':
                // NOTE: if page was 0, we don't have any prev page to return
                skip = (page == 0 ? 0 : page - 1) * per_page;
                limit = per_page;
                break;
            default:
                skip = page * per_page;
                limit = per_page;
        }

        console.log('limit: ', limit, 'skip: ', skip);
        console.log('*** Sort: ', Sorts, ' ***');

        let movies = await Movies.find({})
            .sort(Sorts)
            .project(Projection)
            .skip(skip)
            .limit(limit)
            .toArray();

        if (!movies.length) throw new NotFoundError('Movie Not Founded');
        response.status(StatusCodes.OK).json({ movies, n: movies.length });
    }

    getSingleMovie(request, response, next) {
        const { movieId } = request.params;

        let movie = Movies.findOne(
            { _id: movieId },
            { lastupdated: 0, tomatoes: 0, poster: 0 }
        );
        let comments = Comments.find({ movie_id: movieId }).toArray();
        let likes = Likes.find({ movie_id: movieId }).toArray();
        Promise.all([movie, comments, likes])
            .then(([movie, comments, likes]) => {
                if (!movie) throw new NotFoundError('Movie not found');

                movie.num_mflix_comments = comments.length;
                movie.comments = comments;
                movie.likes = likes.length;
                response.status(StatusCodes.OK).json({ movie: movie });
            })
            .catch(next);
    }

    likeMovie(request, response, next) {
        const {
            user: { sub, name },
            params: { movieId },
        } = request;

        const movie = Movies.findOne({ _id: movieId });
        const user = Likes.findOne({
            movie_id: movieId,
            user_id: new ObjectId(sub),
        });

        Promise.all([movie, user])
            .then(([movie, user]) => {
                if (user) throw new BadRequestError('Already liked');
                if (!movie)
                    throw new NotFoundError(`Movie ${movieId} not found`);

                Likes.insertOne({
                    user_id: new ObjectId(sub),
                    movie_id: movie._id,
                })
                    .then((v) => {
                        response.status(StatusCodes.OK).json({
                            msg: `User ${name} like movie ${movieId} successfully`,
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    unlikeMovie(request, response, next) {
        const {
            user: { sub, name },
            params: { movieId },
        } = request;

        Likes.findOneAndDelete({
            movie_id: movieId,
            user_id: new ObjectId(sub),
        })
            .then((value) => {
                if (!value.value)
                    throw new BadRequestError(
                        `You didn't like movie ${movieId}`
                    );
                response
                    .status(StatusCodes.OK)
                    .json({ msg: `User ${name} unlike movie ${movieId}` });
            })
            .catch(next);
    }

    postComment(request, response, next) {
        const {
            user: { sub, name, email },
            params: { movieId },
            body: { text },
        } = request;

        const movie = Movies.findOne({ _id: movieId });
        const user = Comments.findOne({
            movie_id: movieId,
            usre_id: new ObjectId(sub),
        });

        Promise.all([movie, user])
            .then(([movie, user]) => {
                if (!movie)
                    throw new NotFoundError(`Movie ${movieId} is not found`);
                if (user) throw new BadRequestError('Already posted comment');

                Comments.insertOne({
                    name,
                    email,
                    text,
                    movie_id: movieId,
                    date: new Date(),
                })
                    .then((v) => {
                        response.status(StatusCodes.OK).json({
                            msg: `User ${name} posted comment for movie ${movieId} successfully`,
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    deleteComment(request, response, next) {
        const {
            user: { name, email },
            params: { movieId },
        } = request;

        Comments.findOneAndDelete({ movie_id: movieId, email: email })
            .then((value) => {
                if (!value.value)
                    throw new NotFoundError(
                        `You don't have any comment on movie ${movieId}`
                    );
                response.status(StatusCodes.OK).json({
                    msg: `User ${name} deleted her/his comment on movie ${movieId}`,
                });
            })
            .catch(next);
    }
}

module.exports = new MovieContorller();
