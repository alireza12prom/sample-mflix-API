const { client } = require('./connect');
const COLLECTION = 'admins';

module.exports = client.db(process.env.MONGO_DB).collection(COLLECTION);
