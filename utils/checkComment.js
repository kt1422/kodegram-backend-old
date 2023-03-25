const Comment = require("../model/commentModel");

const getNumComments = async (post_id) => {
    const numComments = await Comment.countDocuments({post_id: post_id});
    return numComments;
}

module.exports = {
    getNumComments
};