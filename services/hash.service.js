const bcrypt = require('bcryptjs');

class HashService {
    constructor() {}

    hash(password) {
        return bcrypt.hashSync(password, 10);
    }

    compare(string, hashed) {
        return bcrypt.compareSync(string, hashed);
    }
}

module.exports = new HashService();
