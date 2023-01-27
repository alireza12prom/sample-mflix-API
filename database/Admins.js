const { model } = require('mongoose');
const { adminSchema } = require('./schema');

class AdminsModel {
  constructor() {
    this.client = model('admins', adminSchema);
  }
}

module.exports = new AdminsModel().client;
