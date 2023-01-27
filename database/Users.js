const { model } = require('mongoose');
const { userSchema } = require('./schema');

module.exports = model('users', userSchema);
