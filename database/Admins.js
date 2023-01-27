const { model } = require('mongoose');
const { userSchema } = require('./schema');

module.exports = model('admins', userSchema);
