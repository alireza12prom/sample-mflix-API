'use strict';

const { StatusCodes } = require('http-status-codes');
const { Users, Admins } = require('../database');
const { NotFoundError, BadRequestError } = require('../errors');
const { HashService } = require('../services');
const registerController = require('./register.controller');

class UsersController {
  constructor() {}

  async exists(request, response) {
    const {
      params: { userId },
    } = request;

    const target = await Users.exists({ _id: userId });
    if (!target) throw new NotFoundError();

    response.status(StatusCodes.NO_CONTENT);
    response.end();
  }

  async find(request, response) {
    const {
      params: { userId },
    } = request;

    const user = await Users.findById({ _id: userId });
    if (!user) throw new NotFoundError(`User not found`);

    response.status(StatusCodes.OK);
    response.json({ user });
  }

  async all(request, response) {
    const users = await Users.find({}, { password: 0 });
    response.status(StatusCodes.OK).json({ users });
  }

  async create(request, response) {
    const { name, email, password, as } = request.body;

    const [user, admin] = await Promise.all([
      Users.findOne({ email }),
      Admins.findOne({ email }),
    ]);

    if (user || admin)
      throw new BadRequestError(`Email ${email} already registred`);

    const hashedPass = HashService.hash(password);
    if (as === 'USER') {
      await Users.create({ name, email, password: hashedPass });
      response.status(StatusCodes.CREATED);
    } else {
      await Admins.create({ name, email, password: hashedPass });
      response.status(StatusCodes.CREATED);
    }
    response.json({ user: { name, email, as } });
  }

  async update(request, response) {
    const {
      body: { name, email, password },
      params: { userId },
    } = request;

    const hashedPass = password ? HashService.hash(password) : password;
    const value = await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { name: name, email: email, password: hashedPass } },
      { returnDocument: 'after', ignoreUndefined: true }
    );
    if (!value) throw new NotFoundError(`User not found`);

    response.status(StatusCodes.OK);
    response.json({ updated_user: value });
  }

  async delete(request, response) {
    const { userId } = request.params;

    const target = await Users.findByIdAndDelete({ _id: userId });
    if (!target) throw new NotFoundError(`Usre not found`);

    response.status(StatusCodes.OK);
    response.json({ user: target });
  }
}

module.exports = new UsersController();
