const { client } = require('./connect')
const COLLECTION  = 'likes'; 

module.exports = client.db(process.env.MONGO_DB).collection(COLLECTION);