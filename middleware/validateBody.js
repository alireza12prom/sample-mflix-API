'use strict';

const Joi = require('joi');
const { BadRequestError } = require('../errors');

const nameSchema = Joi.string().trim().lowercase();
const passwordSchema = Joi.string().trim().alphanum();
const emailSchema = Joi.string().trim().lowercase().email();

const newUserSchema = Joi.object({
  name: nameSchema.min(3).required(),
  email: emailSchema.required(),
  password: passwordSchema.min(10).required(),
});

const newUserSchema2 = Joi.object({
  name: nameSchema.min(3).required(),
  email: emailSchema.required(),
  password: passwordSchema.min(10).required(),
  as: Joi.string().uppercase().trim().valid('USER', 'ADMIN').required(),
});

const updateUserSchema = Joi.object({
  name: nameSchema.min(3),
  email: emailSchema,
  password: passwordSchema,
});

const userSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
});

class ValidateBody {
  constructor() {}

  validateBodyOnUpdateUser(request, response, next) {
    const { name, email, password } = request.body;

    const { error, value } = updateUserSchema.validate({
      name,
      email,
      password,
    });
    if (error) throw new BadRequestError(`${error.details[0].message}`);

    request.body = value;
    next();
  }

  validateBodyOnRegisterUser(request, response, next) {
    const { name, email, password } = request.body;

    const { error, value } = newUserSchema.validate({
      name,
      email,
      password,
    });
    if (error) throw new BadRequestError(error.details[0].message);

    request.body = value;
    next();
  }

  validateBodyOnCreateUser(request, response, next) {
    const { name, email, password, as } = request.body;

    const { error, value } = newUserSchema2.validate({
      name,
      email,
      password,
      as,
    });
    if (error) throw new BadRequestError(error.details[0].message);

    request.body = value;
    next();
  }

  validateBodyOnAuthenticationUser(request, response, next) {
    const { email, password } = request.body;

    const { error, value } = userSchema.validate({
      email,
      password,
    });
    if (error) throw new BadRequestError(error.details[0].message);

    request.body = value;
    next();
  }
}

module.exports = new ValidateBody();
