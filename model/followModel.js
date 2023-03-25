const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
    user_followed: {
        type: String,
        required: true
    },
    user_follower: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Follow = mongoose.model("follows", followSchema);
module.exports = Follow;