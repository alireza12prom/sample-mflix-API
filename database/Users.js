'use strict';

const { model } = require('mongoose');
const { userSchema } = require('./schema');

class UsersModel {
  constructor() {
    this.client = model('users', userSchema);
  }
}

module.exports = new UsersModel().client;
