const bcrypt = require('bcryptjs');
const crypto = require('crypto');
class HashService {
  constructor() {}

  randomkeyid() {
    const hash = crypto.createHash('sha256');
    return hash.update(crypto.randomUUID()).digest().toString('hex');
  }

  hash(password) {
    return bcrypt.hashSync(password, 10);
  }

  compare(string, hashed) {
    return bcrypt.compareSync(string, hashed);
  }
}

module.exports = new HashService();
