const User = require('../model/userModel');
const Post = require('../model/postModel');
const Follow = require('../model/followModel');
const { userValidation, isEmailExisting, isUsernameExisting } = require('../utils/joi');
const { securePassword, comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');

const user_get = async (req, res) => {
	try {
        const userId = req.getUser.id;
        const rawUsers = await User.find({ _id: { $ne: userId } });
        const allUsers = [];
        for(let user of rawUsers) {
            let btnFollow = "Disabled";
            const followRecord = await Follow.findOne({user_followed: user._id, user_follower: userId});
            btnFollow = (followRecord)?"Following":"Follow";
            
            const obj = {
                user_id: user._id,
                fname: user.fname,
                username: user.username,
                pic: user.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                btnFollow: btnFollow
            }
            allUsers.push(obj)
        }

        res.send({status: "success", message: "Got all users", allUsers});
	} catch (error) {
		res.send({status: "error", message: "backend error"});
		console.log(error);
	}
}

const user_add = async (req, res) => {
    try {
        const { error } = userValidation.validate(req.body);
        if(error) return res.send({status: "error", message: error.details[0].message});

        const isEmailExisting = await isEmailExisting(req.body.email);
        if(isEmailExisting) return  res.send({status: "error", message: isEmailExisting});

        const isUsernameExisting = await isUsernameExisting(req.body.username);
        if(isUsernameExisting) return  res.send({status: "error", message: isUsernameExisting});
        
        const newUser = new User({
            fname: req.body.fname,
            username: req.body.username,
            email: req.body.email,
            pic: "",
            bio: "",
            gender: "",
            phone: null,
            address: "",
            status: "Offline",
            password: await securePassword(req.body.password)
        });

        await newUser.save();
        delete newUser.password;
        res.send({
            status: "success",
            message: "You have successfuly created an account!"
        });
    } catch (error) {
        // res.send({status: "error", message: "backend error"});
        console.log(error);
    }
}

const user_update = async (req, res) => {
	try {
        const userId = req.getUser.id;
        const editUser = await User.findByIdAndUpdate(userId, {
            pic: req.body.pic,
            fname: req.body.fname,
            bio: req.body.bio,
        });
        res.send({
            status: "success",
            message: "You have successfuly update your account!"
        });
	} catch (error) {
		res.send({status: "error", message: "backend error"});
		console.log(error);
	}
}

const user_login = async (req, res) => {
    try {
        const logUser = await User.findOne({email: req.body.email});
        if(!logUser) return res.send({status: "error", message: "The email you've entered is not connected to an account."});

        const isValid = await comparePassword(req.body.password, logUser.password);
        if(!isValid) return res.send({status: "error", message: "The password you've entered is incorrect."});

        const token = jwt.sign({
            id: logUser.id,
            email: logUser.email
            }, process.env.TOKEN_SECRET);//{expiresIn: "2h"}

        delete logUser.password;
        res.send({status: "success", message: "Logged In Successfully", token});
    } catch (error) {
        // res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_home = async (req, res) => {
    try {
        const userId = req.getUser.id;
        if(userId) {
            const logUser = await User.findOne({_id: userId});
            const user = {
                user_id: userId,
                fname: logUser.fname,
                username: logUser.username,
                bio: logUser.bio,
                pic: logUser.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            res.send({status: "success", message: "Hello user", user});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_profile = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        const isOwner = userId==profileId;
        if(userId) {
            const logUser = await User.findOne({_id: profileId});
            const followRecord = await Follow.findOne({user_followed: profileId, user_follower: userId});
            const btnFollow = (followRecord)?"Following":"Follow";
            const user = {
                fname: logUser.fname,
                username: logUser.username,
                pic: logUser.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                bio: logUser.bio,
                isOwner: isOwner
            }
            res.send({status: "success", message: "Hello user", user, btnFollow});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_follow = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        const isFollowing = req.body.isFollowing;
        if(userId) {
            if(isFollowing){
                const newFollow = new Follow({
                    user_followed: profileId,
                    user_follower: userId
                });
                await newFollow.save();
                res.send({status: "success", message: "Profile has been followed successfully"});
            } else {
                const followRecord = await Follow.findOne({user_followed: profileId, user_follower: userId});
                await Follow.findByIdAndDelete(followRecord._id);
                res.send({status: "success", message: "You have unfollowed this user"});
            }
            
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_follow_count = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        if(userId) {
            const numFollower = await Follow.countDocuments({user_followed: profileId});
            const numFollowing = await Follow.countDocuments({user_follower: profileId});
            const numPost = await Post.countDocuments({user_id: profileId});
            res.send({status: "success", message: "Got all follow details", numFollower, numFollowing, numPost});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_followers = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        if(userId) {
            const rawFollowers = await Follow.find({user_followed: profileId});
            const followers = [];
            for(let rowFollower of rawFollowers) {
                const logUser = await User.findOne({_id: rowFollower.user_follower});
                let btnFollow = "Disabled";
                if(userId!==rowFollower.user_follower){
                    const followRecord = await Follow.findOne({user_followed: rowFollower.user_follower, user_follower: userId});
                    btnFollow = (followRecord)?"Following":"Follow";
                }
                const objPost = {
                    user_id: rowFollower.user_follower,
                    fname: logUser.fname,
                    username: logUser.username,
                    pic: logUser.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    btnFollow: btnFollow
                }
                followers.push(objPost)
            }
            res.send({status: "success", message: "Got all follow details", followers});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

const user_followings = async (req, res) => {
    try {
        const userId = req.getUser.id;
        const profileId = req.body.id;
        if(userId) {
            const rawFollowings = await Follow.find({user_follower: profileId});
            const followings = [];
            for(let rowFollowing of rawFollowings) {
                const logUser = await User.findOne({_id: rowFollowing.user_followed});
                let btnFollow = "Disabled";
                if(userId!==rowFollowing.user_followed){
                    const followRecord = await Follow.findOne({user_followed: rowFollowing.user_followed, user_follower: userId});
                    btnFollow = (followRecord)?"Following":"Follow";
                }
                const objPost = {
                    user_id: rowFollowing.user_followed,
                    fname: logUser.fname,
                    username: logUser.username,
                    pic: logUser.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    btnFollow: btnFollow
                }
                followings.push(objPost)
            }
            res.send({status: "success", message: "Got all follow details", followings});
        } else {
            res.send({status: "error", message: "No user"});
        }
    } catch (error) {
        res.send({status: "error", message: "backend error"});
		console.log(error);
    }
}

module.exports = {
    user_get,
    user_add,
    user_update,
    user_login,
    user_home,
    user_profile,
    user_follow,
    user_follow_count,
    user_followers,
    user_followings
}