'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const jwtConfig = require('../config/jwt.js');

const publicKey = fs.readFileSync(
    path.join(path.dirname(__dirname), '/config/pub_key.key'),
    'utf-8'
);
const privateKey = fs.readFileSync(
    path.join(path.dirname(__dirname), '/config/priv_key.key'),
    'utf-8'
);

class JwtService {
    constructor() {}

    sign(payload) {
        return jwt.sign(payload, privateKey, jwtConfig.options);
    }

    verify(token) {
        try {
            return jwt.verify(token, publicKey, jwtConfig.options);
        } catch (error) {
            return false;
        }
    }

    decode(token) {
        return jwt.decode(token, { complete: true }).payload;
    }
}

module.exports = new JwtService();
