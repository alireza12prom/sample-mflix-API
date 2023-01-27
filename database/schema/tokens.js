const { Schema } = require('mongoose');

module.exports = new Schema(
  {
    keyid: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    create_at: {
      type: Date,
      require: true,
      expires: '12h',
    },
  },
  { collection: 'tokens' }
);
