'use strict';

const Comments = require('./Comments');
const Likes = require('./Likes');
const { movieSchema } = require('./schema');
const { model } = require('mongoose');
const {
  MovieNotFoundError,
  AlreadyExistsError,
  LikeNotFoundError,
  CommentNotFoundError,
} = require('./error');

const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
};

class MoviesModel {
  constructor() {
    this.client = model('movies', movieSchema);
  }

  async getAllMovies(queries) {
    // objects
    let SortObject = {};
    let FilterObject = {};
    const ProjectObject = {
      tomatoes: 0,
      awards: 0,
      fullplot: 0,
      poster: 0,
      lastupdated: 0,
    };

    // pagination
    let skip, limit;
    let { page, per_page, rel } = queries;

    switch (rel) {
      case 'first':
        skip = 0;
        limit = (page + 1) * per_page;
        break;
      case 'last':
        skip = 0;
        limit = (page + 1) * per_page;
        SortObject.$natural = -1;
        break;
      default:
        skip = page * per_page;
        limit = per_page;
    }

    // Filtering
    let { languages, genres, year, countries, q } = queries;

    if (q) FilterObject.$text = { $search: `"${q}"` };
    if (languages) FilterObject.languages = languages;
    if (genres) FilterObject.genres = genres;
    if (countries) FilterObject.countries = countries;
    if (year) FilterObject.year = year;

    try {
      const movies = await this.client.find(FilterObject, ProjectObject, {
        sort: SortObject,
        skip: skip,
        limit: limit,
      });

      if (!movies.length) throw new MovieNotFoundError();
      return movies;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSingleMovie(movieId) {
    // objects
    const MovieObject = [movieId, { lastupdated: 0, tomatoes: 0, poster: 0 }];

    try {
      let [comments, movie] = await Promise.all([
        Comments.find({ movie_id: movieId }),
        this.client.findById(...MovieObject),
      ]);

      if (!movie) throw new MovieNotFoundError();
      movie.comments = comments;
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async likeMovie(userId, movieId) {
    // objects
    const LikeObject = [
      { user_id: userId, movie_id: movieId, date: Date.now() },
    ];

    const MovieObject = [
      { _id: movieId },
      { $inc: { likes: 1 } },
      { returnDocument: 'after' },
    ];

    try {
      const newLike = await Likes.create(...LikeObject);
      const target = await this.client.findOneAndUpdate(...MovieObject);

      if (!target) {
        await Likes.deleteOne({ _id: newLike._id });
        throw new MovieNotFoundError();
      } else return newLike;
    } catch (error) {
      if (error.code === 11000) throw new AlreadyExistsError();
      throw error;
    }
  }

  async unlikeMovie(userId, movieId) {
    // objects
    const LikeObject = [{ movie_id: movieId, user_id: userId }];

    const MovieObject = [
      { _id: movieId, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { returnDocument: 'after' },
    ];

    try {
      let tar1 = await Likes.findOneAndDelete(...LikeObject);
      if (!tar1) throw new LikeNotFoundError();

      let tar2 = await this.client.findOneAndUpdate(...MovieObject);
      if (!tar2) throw new MovieNotFoundError();
      console.log(tar2);
      return tar1;
    } catch (error) {
      throw error;
    }
  }

  async postComment(movieId, name, email, text) {
    // objects
    const CommentObject = [
      {
        name,
        email,
        movie_id: movieId,
        text,
        date: Date.now(),
      },
    ];

    const MovieObject = [
      { _id: movieId },
      { $inc: { comments: 1 } },
      { returnDocument: 'after' },
    ];

    try {
      const newComment = await Comments.create(...CommentObject);
      const result = await this.client.findOneAndUpdate(...MovieObject);

      if (!result) {
        await Comments.deleteOne({ _id: newComment._id });
        throw new MovieNotFoundError();
      } else return newComment;
    } catch (error) {
      if (error.code === 11000) throw new AlreadyExistsError();
      throw error;
    }
  }

  async deleteComment(email, movieId) {
    // objects
    const CommentObjects = [{ email, movie_id: movieId }];

    const MovieObjects = [
      { _id: movieId, comments: { $gt: 0 } },
      { $inc: { comments: -1 } },
      { returnDocument: 'after' },
    ];

    try {
      const tar1 = await Comments.findOneAndDelete(...CommentObjects);
      if (!tar1) throw new CommentNotFoundError();

      const tar2 = await this.client.findOneAndUpdate(...MovieObjects);
      if (!tar2) throw new MovieNotFoundError();

      return tar2;
    } catch (error) {
      throw error;
    }
  }

  async editComment(text, email, movieId) {
    // object
    const CommentObject = [
      { email, movie_id: movieId },
      { $set: { text } },
      { returnDocument: 'after' },
    ];

    try {
      const target = await Comments.findOneAndUpdate(...CommentObject);
      if (!target) throw new CommentNotFoundError();

      return target;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MoviesModel();
