const { MongoClient } = require('mongodb');

let client = new MongoClient(process.env.MONGO_URL, { monitorCommands: true });

module.exports = {
    client,
};
