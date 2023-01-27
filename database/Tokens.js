'use strict';

const { tokenSchema } = require('./schema');
const { model } = require('mongoose');
const { date } = require('joi');

class TokensModel {
  constructor() {
    this.client = model('tokens', tokenSchema);
  }
}

module.exports = new TokensModel().client;
