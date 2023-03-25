const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    attachment: {
        type: [String],
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model("posts", postSchema);
module.exports = Post;