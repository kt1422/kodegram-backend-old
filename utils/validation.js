const joi = require("joi");
const User = require('../model/userModel');

const userValidation = joi.object({
    fname: joi.string().min(3).max(30).required(),
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required(),
    confirm_password: joi.ref('password')
}).with('password', 'confirm_password');

const loginValidation = joi.object({
    email: joi.string().email().trim(true).required(),
    password: joi.string().min(8).trim(true).required()
});

const isEmailExisting = async (inputEmail) => {
    const email = await User.findOne({email: inputEmail}); 
    if(email) {
        error = `${inputEmail} is already exist!`;
        return error;
    }
}

const isUsernameExisting = async (inputUsername) => {
    const username = await User.findOne({username: inputUsername}); 
    if(username) {
        error = `${inputUsername} is already exist!`;
        return error;
    }
}

module.exports = {
    userValidation,
    loginValidation,
    isEmailExisting,
    isUsernameExisting
}