'use strict';

const { likeSchema } = require('./schema');
const { model } = require('mongoose');
class LikesModel {
  constructor() {
    this.client = model('likes', likeSchema);
    this.#setup();
  }

  async #setup() {
    await likeSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });
  }
}

module.exports = new LikesModel().client;
