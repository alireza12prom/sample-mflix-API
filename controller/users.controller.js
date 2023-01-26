'use strict';

const { StatusCodes } = require('http-status-codes');
const { Users } = require('../database');
const { NotFoundError, BadRequestError } = require('../errors');

class UsersController {
  constructor() {}

  async exists(request, response) {
    const {
      params: { userId },
    } = request;

    const { valueOf } = await Users.countDocuments({ _id: userId });
    if (!valueOf) throw new NotFoundError(`User ${userId} is not found`);
    response.status(StatusCodes.NO_CONTENT);
    response.send();
  }

  async find(request, response) {
    const {
      params: { userId },
    } = request;

    const user = await Users.findOne({ _id: userId });
    if (!user) throw new NotFoundError(`User ${userId} is not found`);

    response.status(StatusCodes.OK);
    response.json({ user: user });
  }

  async all(request, response) {
    const users = await Users.find().toArray();
    response.status(StatusCodes.OK).json({ users });
  }

  async create(request, response) {
    const { name, email } = request.body;

    let user = await Users.findOne({ email: email });
    if (user) throw new BadRequestError(`User ${email} already exists`);

    const result = await Users.insertOne({ name, email });
    response.status(StatusCodes.CREATED);
    response.json({ msg: `New user ${result.insertedId} created` });
  }

  async replace(request, response) {
    const {
      body: { name, email },
      params: { userId },
    } = request;

    let { value } = await Users.findOneAndReplace(
      { _id: userId },
      { name, email },
      { returnDocument: 'after' }
    );
    if (!value) throw new NotFoundError(`User ${userId} is not found`);

    response.status(StatusCodes.OK);
    response.json({ new_user: value });
  }

  async update(request, response) {
    const {
      body: { name, email },
      params: { userId },
    } = request;

    const { value } = await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { name: name, email: email } },
      { returnDocument: 'after', ignoreUndefined: true }
    );
    if (!value) throw new NotFoundError(`User ${userId} is not found`);

    response.status(StatusCodes.OK);
    response.json({ updated_user: value });
  }

  async delete(request, response) {
    const { userId } = request.params;

    const { value } = await Users.findOneAndDelete({ _id: userId });
    if (!value) throw new NotFoundError(`Usre ${userId} is not found`);

    response.status(StatusCodes.OK);
    response.json({ deleted_user: value });
  }
}

module.exports = new UsersController();
