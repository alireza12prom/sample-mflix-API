const { StatusCodes } = require('http-status-codes');
const { Users, Admins } = require('../database');
const { BadRequestError } = require('../errors');
const { HashService } = require('../services');

class RegisterController {
  constructor() {}

  async register(request, response) {
    const { name, email, password } = request.body;

    const [user, admin] = await Promise.all([
      Users.findOne({ email }),
      Admins.findOne({ email }),
    ]);

    if (user || admin)
      throw new BadRequestError(`Email ${email} already registred`);

    const hashedPass = HashService.hash(password);
    await Users.insertOne({ name, email, password: hashedPass });
    response.status(StatusCodes.CREATED);
    response.json({ user: { name, email } });
  }
}

module.exports = new RegisterController();
