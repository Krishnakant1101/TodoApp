const Joi = require('joi');

const signupSchema = Joi.object({
    firstname: Joi.string().max(30).alphanum().required(),
    lastname: Joi.string().max(30).alphanum(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{3,30}$')).required(),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{3,30}$')).required(),
});

module.exports = { signupSchema, loginSchema };
