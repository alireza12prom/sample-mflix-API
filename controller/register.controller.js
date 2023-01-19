const { StatusCodes } = require("http-status-codes");
const { Users, Admins } = require("../database");
const { BadRequestError } = require("../errors");
const { HashService } = require('../services');

class RegisterController {
    constructor() {}

    register(request, response, next) {
        const { name, email, password } = request.body;

        const user = Users.findOne({ email: email });
        const admin = Admins.findOne({ email: email });

        return Promise.all([ user, admin ])
            .then(([user, admin]) => {
                if (user || admin) throw new BadRequestError(`Email ${email} already registred`);
                
                const hashedPass = HashService.hash(password);
                Users.insertOne({ name, email, password:hashedPass })
                    .then((v) => {
                        response.status(StatusCodes.CREATED).json({ user: { name, email }});
                    }).catch(next);
            }).catch(next)
    }
}

module.exports = new RegisterController();