'use strict';

require("dotenv").config();
require('./schema');
require("express-async-errors");

const bodyParser = require("body-parser");
const logger = require("morgan");
const { client } = require('./database/connect');
const { errorHandlerMiddleware } = require("./middleware");
const cors = require('cors');
const express = require("express");
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/', require('./routes'))

// not found route
app.use(errorHandlerMiddleware.routeNotFound);

// error handler
app.use(errorHandlerMiddleware.onError);

const start = async () => {
    client.connect()
        .then((v) => {
            console.log('<< Mongodb Connected >>');
            client.emit('connected');  
        })
        .then((v) => {
            const port = process.env.PORT || 3000;
            const host = process.env.HOST || 'localhost';
            const server = app.listen(port, () => {
                console.log(`Server: http://${host}:${port}`);
            })
            
            server.setTimeout(8000);
            server.on('timeout', (socket) => {
                socket.destroy();
            });
        })
        .catch((e) => {
            console.log("<< Connecting to mongodb faild >>");
            process.exit(1);
        })
}
start();