const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    post_id: {
        type: String,
        required: true
    },
    comment_user_id: {
        type: String,
        required: true
    },
    comment_to: {
        type: String
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Comment = mongoose.model("comments", commentSchema);
module.exports = Comment;