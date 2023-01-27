const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    title: String,
    fulplot: String,
    countries: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: Object,
    lastupdated: Date,
    year: Number,
    imdb: Object,
    type: String,
    comments: [Number | Array],
    likes: Number,
  },
  { collection: 'movies' }
);
