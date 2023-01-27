const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    movie_id: { type: Schema.Types.ObjectId, require: true },
    text: { type: String, require: true },
    Date: { type: Number, require: true },
  },
  { collection: 'comments' }
);
