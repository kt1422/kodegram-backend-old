const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pic: {
        type: String
    },
    bio: {
        type: String,
    },
    gender: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    status: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model("users", userSchema);
module.exports = User;