const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { collection: 'users' }
);
