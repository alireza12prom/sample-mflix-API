const { client } = require('./connect')
const COLLECTION  = 'movies'; 

module.exports = client.db(process.env.MONGO_DB).collection(COLLECTION);