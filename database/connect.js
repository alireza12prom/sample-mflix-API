'use strict';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

let client;
const strat = async () => {
  client = await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000, // 1 second
    monitorCommands: true,
  });
  return client;
};

mongoose.connection.on('connected', (error) => {
  console.log('<< mongodb connected >>');
});

mongoose.connection.on('error', async (error) => {
  if (error instanceof mongoose.Error.MongooseServerSelectionError) {
    console.log('<< connecting to mongodb faild >>');

    await mongoose.connection.close();
  }
});

mongoose.connection.on('close', () => {
  console.log('<< connection close >>');
});

module.exports = {
  client,
  strat,
};
