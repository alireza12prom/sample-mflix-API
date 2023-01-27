const Movies = require('./Movies');
const Users = require('./Users');
const Comments = require('./Comments');
const Likes = require('./Likes');
const Admins = require('./Admins');
const { client, strat } = require('./connect');
const Tokens = require('./Tokens');

module.exports = {
  Movies,
  Users,
  Comments,
  Likes,
  Admins,
  client,
  strat,
  Tokens,
};
