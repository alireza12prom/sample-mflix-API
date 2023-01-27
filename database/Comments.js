'use strict';

const { commentSchema } = require('./schema');
const { model } = require('mongoose');
class CommentsModel {
  constructor() {
    this.client = model('comments', commentSchema);
    this.#setup();
  }

  async #setup() {
    await commentSchema.index({ email: 1, movie_id: 1 }, { unique: true });
  }
}

module.exports = new CommentsModel().client;
