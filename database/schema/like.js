const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, require: true },
    movie_id: { type: Schema.Types.ObjectId, require: true },
    date: { type: Number, require: true },
  },
  { collection: 'likes' }
);
