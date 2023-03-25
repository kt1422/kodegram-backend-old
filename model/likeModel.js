const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    post_id: {
        type: String,
        required: true
    },
    user_posted: {
        type: String,
        required: true
    },
    user_liked: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Like = mongoose.model("likes", likeSchema);
module.exports = Like;