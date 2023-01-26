const { StatusCodes } = require('http-status-codes');
const { Users, Admins } = require('../database');
const { UnauthorizedError } = require('../errors');
const { JwtService } = require('../services');

// FIXME: authentication when user already have token

class AuthenticateController {
    constructor() {}

    authenticate(request, response, next) {
        const bearer = request.header('Authorization');
        if (bearer) {
            return response.status(200).json({ token: bearer.split(' ')[1] });
        }

        const { email } = request.body;

        let user = Users.findOne({ email: email });
        let admin = Admins.findOne({ email: email });
        Promise.all([user, admin])
            .then(([user, admin]) => {
                if (!user && !admin)
                    throw new UnauthorizedError(`User ${email} has no account`);
                let role = user ? 'USER' : 'ADMIN';
                let name = user ? user.name : admin.name;
                let id = user ? user._id : admin._id;
                let token = JwtService.sign({
                    name,
                    email,
                    role: role,
                    sub: id,
                });
                response.status(StatusCodes.OK).json({ token });
            })
            .catch(next);
    }
}

module.exports = new AuthenticateController();
