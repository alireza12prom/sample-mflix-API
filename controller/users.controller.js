'use strict';

const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { Users } = require("../database");
const { NotFoundError, BadRequestError } = require("../errors");

class UsersController {
    constructor() {}

    exists(request, response, next) {
        const { params: { userId } } = request;
       
        return Users.countDocuments({ _id: userId })
            .then((n) => {
                if (!n) throw new NotFoundError(`User ${userId} is not found`);
                response.status(StatusCodes.NO_CONTENT).send();
            }).catch(next);
    }

    find(request, response, next) {
        const { params: { userId } } = request;
        
        return Users.findOne({ _id: userId })
            .then((user) => {
                if (!user) throw new NotFoundError(`User ${userId} is not found`);
                response.status(StatusCodes.OK).json({ user:user });
            }).catch(next);

    }

    all(request, response, next) {
        return Users.find().toArray()
            .then((users) => {
                response.status(StatusCodes.OK).json({ users });
            }).catch(next);
    }

    create(request, response, next) {
        const { name, email } = request.body;

        let user = Users.findOne({ email: email })
            .then((v) => {
                if (v) throw new BadRequestError(`User ${email} already exists`);

                Users.insertOne({ name, email })
                    .then((v) => {
                        response.status(StatusCodes.CREATED).json({ msg: `New user ${v.insertedId} created` });
                    }).catch(next);
            }).catch(next);
    }

    replace(request, response, next) {
        const { body: {name, email}, params: { userId } } = request;

        return Users.findOneAndReplace({ _id: userId }, { name, email }, { returnDocument: 'after' })
            .then((v) => {
                if (!v.value) throw new NotFoundError(`User ${userId} is not found`);
                response.status(StatusCodes.OK).json({ new_user: v.value });
            }).catch(next);
    }

    update(request, response, next) {
        const { body: {name, email}, params: { userId } } = request;

        return Users.findOneAndUpdate({ _id: userId}, { $set: { name:name, email:email } }, { returnDocument: 'after', ignoreUndefined:true })
            .then((v) => {
                if (!v.value) throw new NotFoundError(`User ${userId} is not found`);
                response.status(StatusCodes.OK).json({ updated_user: v.value });
            }).catch(next);
    }

    delete(request, response, next) {
        const { userId } = request.params;

        return Users.findOneAndDelete({ _id: userId })
            .then((v) => {
                if (!v.value) throw new NotFoundError(`Usre ${userId} is not found`);
                response.status(StatusCodes.OK).json({ deleted_user: v.value });
            }).catch(next);
    }
}

module.exports = new UsersController();