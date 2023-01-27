const { StatusCodes } = require('http-status-codes');
const { Users, Admins, Tokens } = require('../database');
const { UnauthorizedError } = require('../errors');
const { JwtService, HashService } = require('../services');

class AuthenticateController {
  constructor() {}

  async authenticate(request, response) {
    const { email, password } = request.body;

    // validate email
    const [user, admin] = await Promise.all([
      Users.findOne({ email: email }),
      Admins.findOne({ email: email }),
    ]);
    if (!user && !admin) throw new UnauthorizedError(`User has no account`);

    // compare password
    const hashedPass = admin ? admin.password : user.password;
    if (!HashService.compare(password, hashedPass))
      throw new UnauthorizedError(`Password was wrong`);

    // create a unique api key and save it in database
    const keyid = HashService.randomkeyid();
    await Tokens.create({
      create_at: new Date(),
      email,
      keyid,
    });

    // create a jwt token and send response
    const TokenObject = {
      role: user ? 'USER' : 'ADMIN',
      name: user ? user.name : admin.name,
      sub: user ? user._id : admin._id,
      keyid,
      email,
    };

    response.status(StatusCodes.OK);
    response.json({ token: JwtService.sign(TokenObject) });
  }
}

module.exports = new AuthenticateController();
