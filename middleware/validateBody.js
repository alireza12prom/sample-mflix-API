'use strict';

const Joi = require("joi");
const { BadRequestError } = require("../errors");


const schema = {
    name: Joi.string().trim().lowercase().min(1).max(20),
    email: Joi.string().trim().lowercase().email()  
}


class ValidateBody {
    constructor() {}


    validateBodyOnUpdateUser(request, response, next) {
        const { name, email } = request.body;

        const { error, value } = Joi.object(schema).validate({ name, email });
        if (error) {
            throw new BadRequestError(`${error.details[0].message}`);
        } 
        request.body = value;
        next();
    }

    validateBodyOnCreateUser(request, response, next) {
        const { name, email } = request.body;

        const newSchema = Object.assign({}, schema);
        newSchema.name = schema.name.required();
        newSchema.email = schema.email.required();

        const { error, value } = Joi.object(newSchema).validate({ name, email });
        if (error) {
            throw new BadRequestError(`${error.details[0].message}`);
        } 
        request.body = value;
        next();
    }

}

module.exports = new ValidateBody();