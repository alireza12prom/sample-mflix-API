const { client } = require('./connect')
const COLLECTION  = 'comments'; 

module.exports = client.db(process.env.MONGO_DB).collection(COLLECTION);