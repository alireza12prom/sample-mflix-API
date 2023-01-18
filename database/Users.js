const { client } = require('./connect')
const COLLECTION  = 'users'; 

module.exports = client.db(process.env.MONGO_DB).collection(COLLECTION);