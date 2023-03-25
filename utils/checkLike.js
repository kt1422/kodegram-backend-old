const Like = require("../model/likeModel");

const getLikeRecord = async (post_id, userId) => {
    const likeRecord = await Like.findOne({post_id: post_id, user_liked: userId});
    if(likeRecord){
        return "Liked";
    } else{
        return "Unlike";
    }
}

const getNumLikes = async (post_id) => {
    const numLikes = await Like.countDocuments({post_id: post_id});
    return numLikes;
}

module.exports = {
    getLikeRecord,
    getNumLikes
};