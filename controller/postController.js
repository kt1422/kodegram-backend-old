const User = require('../model/userModel');
const Post = require('../model/postModel');
const Follow = require('../model/followModel');
const Like = require('../model/likeModel');
const Comment = require('../model/commentModel');
const { checkDate, checkMDY } = require('../utils/checkDate');
const { getLikeRecord, getNumLikes } = require('../utils/checkLike');
const { getNumComments } = require('../utils/checkComment');

const post_add = async (req, res) => {
	try {
        const userId = req.getUser.id;
        if(userId) {
            const logUser = await User.findOne({_id: userId});
            const newPost = new Post({
                user_id: userId,
                caption: req.body.caption,
                attachment: req.body.attachment
            });
            await newPost.save();
            res.send({status: "success", message: "New post created", newPost});
        } else {
            res.send({status: "error", message: "No user"});
        }
	} catch (error) {
		res.status(400).send(error);
		console.log(error);
	}
}

const post_edit = async (req, res) => {
	try {
        const userId = req.getUser.id;
        const post_id = req.body.post_id;
        const caption = req.body.editCaption;
        if(userId) {
            const editPost = await Post.findByIdAndUpdate(post_id, {
                caption: caption
            });
            if(!editPost){
                res.send({status: "error", message: "No post found"});
            } else {
                res.send({status: "success", message: "Post has been updated"});
            }
        } else {
            res.send({status: "error", message: "No user"});
        }
	} catch (error) {
		res.status(400).send(error);
		console.log(error);
	}
}

const post_delete = async (req, res) => {
	try {
        const userId = req.getUser.id;
        const post_id = req.body.post_id;
        if(userId) {
            await Post.findByIdAndDelete(post_id);
            res.send({status: "success", message: "Post has been deleted"});
        } else {
            res.send({status: "error", message: "No user"});
        }
	} catch (error) {
		res.status(400).send(error);
		console.log(error);
	}
}

const post_home = async (req, res) => {
    try {
        const userId = req.getUser.id;
        if(userId) {
            const followedUsers = await Follow.find({user_follower: userId});
            const followedUsersIds = [];
            for(let user of followedUsers){
                followedUsersIds.push(user.user_followed);
            }
            followedUsersIds.push(userId);
            const rawPosts = await Post.find({user_id: { $in: followedUsersIds } }).sort({createdAt: -1});

            const allPosts = [];
            for(let post of rawPosts) {
                const logUser = await User.findOne({_id: post.user_id});
                const objPost = {
                    id: post._id,
                    user_id: post.user_id,
                    username: logUser.username,
                    pic: logUser.pic || "../../src/assets/img/user-icon.png",
                    caption: post.caption,
                    attachment: post.attachment,
                    date: checkDate(post.createdAt),
                    update: checkDate(post.updatedAt),
                    mdy: checkMDY(post.updatedAt),
                    owner: (post.user_id==userId),
                    isLiked: await getLikeRecord(post._id.toString(), userId),
                    numLikes: await getNumLikes(post._id.toString()),
                    numComments: await getNumComments(post._id.toString())
                }
                allPosts.push(objPost)
            }
            res.send({status: "success", message: "Got all posts for home", allPosts});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

const post_profile = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        if(userId) {
            const rawPosts = await Post.find({user_id: profileId}).sort({createdAt: -1});
            const allPosts = [];
            for(let post of rawPosts) {
                const logUser = await User.findOne({_id: post.user_id});
                const objPost = {
                    id: post._id,
                    user_id: post.user_id,
                    username: logUser.username,
                    pic: logUser.pic || "../../src/assets/img/user-icon.png",
                    caption: post.caption,
                    attachment: post.attachment,
                    date: checkDate(post.createdAt),
                    update: checkDate(post.updatedAt),
                    isLiked: await getLikeRecord(post._id.toString(), userId),
                    numLikes: await getNumLikes(post._id.toString()),
                    numComments: await getNumComments(post._id.toString())
                }
                allPosts.push(objPost)
            }
            const total = await Post.countDocuments({user_id: profileId});
            res.send({status: "success", message: "Got all posts for home", allPosts, total});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

const post_like = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const postId = req.body.post_id;
        const isLiked = req.body.isLiked;
        if(userId) {
            if(isLiked) {
                const postDetails = await Post.findById(postId);
                const newLike = new Like({
                    post_id: postId,
                    user_posted: postDetails.user_id,
                    user_liked: userId
                });
                await newLike.save();
                res.send({status: "success", message: "Post has been liked"});
            } else {
                await Like.deleteOne({post_id: postId, user_liked: userId});
                res.send({status: "success", message: "Post has been unliked"});
            }
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

const post_likers = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const postId = req.body.post_id;
        if(userId) {
            const rawLikes = await Like.find({post_id: postId}).sort({createdAt: -1});
            const allUsers = [];
            for(let like of rawLikes) {
                const logUser = await User.findOne({_id: like.user_liked});
                let btnFollow = "Disabled";
                if(userId!==like.user_liked){
                    const followRecord = await Follow.findOne({user_followed: like.user_liked, user_follower: userId});
                    btnFollow = (followRecord)?"Following":"Follow";
                }
                const objUser = {
                    user_id: like.user_liked,
                    fname: logUser.fname,
                    username: logUser.username,
                    pic: logUser.pic || "../../src/assets/img/user-icon.png",
                    btnFollow: btnFollow
                }
                allUsers.push(objUser)
            }
            res.send({status: "success", message: "Got all comments from post", allUsers});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

const comment_add = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const postId = req.body.post_id;
        const commentId = req.body.comment_to;
        const comment = req.body.comment;
        if(userId) {
            const newComment = new Comment({
                post_id: postId,
                comment_user_id: userId,
                comment_to: commentId,
                comment: comment
            });
            const commentAdded = await newComment.save();
            const logUser = await User.findOne({_id: userId});
            const user = {
                username: logUser.username,
                pic: logUser.pic || "../../src/assets/img/user-icon.png"
            }
            res.send({status: "success", message: "Comment has been posted", commentAdded, user});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

const comment_get = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const postId = req.body.post_id;
        if(userId) {
            const rawComments = await Comment.find({post_id: postId}).sort({createdAt: -1});
            const comments = [];
            for(let rowComment of rawComments) {
                const logUser = await User.findOne({_id: rowComment.comment_user_id});
                const objPost = {
                    comment_id: rowComment._id,
                    comment_user: rowComment.comment_user_id,
                    username: logUser.username,
                    pic: logUser.pic || "../../src/assets/img/user-icon.png",
                    comment_to: rowComment.comment_to,
                    comment: rowComment.comment,
                    date: checkDate(rowComment.createdAt)
                }
                comments.push(objPost)
            }
            res.send({status: "success", message: "Got all comments from post", comments: comments});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.status(400).send(error);
		console.log(error);
    }
}

module.exports = {
    post_add,
    post_edit,
    post_delete,
    post_home,
    post_profile,
    post_like,
    post_likers,
    comment_add,
    comment_get
}