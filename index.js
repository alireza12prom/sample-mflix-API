'use strict';

require('dotenv').config();
require('./schema');
require('express-async-errors');

const bodyParser = require('body-parser');
const logger = require('morgan');
const { errorHandlerMiddleware } = require('./middleware');
const cors = require('cors');
const express = require('express');
const { client } = require('./database');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/', require('./routes'));

// not found route
app.use(errorHandlerMiddleware.routeNotFound);

// error handler
app.use(errorHandlerMiddleware.onError);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, async () => {
    await client.connect();
    console.log('<< Mongo Connect >>');

    console.log(`http://${host}:${port}`);
});
