const userRouter = require('express').Router();
const userController = require('../controller/userController');
const jwtAuth = require('../utils/jwtAuth');

userRouter.post('/get', jwtAuth.verify, userController.user_get);

//register user
userRouter.post('/add', userController.user_add);

//update user
userRouter.post('/update', jwtAuth.verify, userController.user_update);

//login user
userRouter.post('/login', userController.user_login);

//home
userRouter.post('/home', jwtAuth.verify, userController.user_home);

//profile info
userRouter.post('/profile', jwtAuth.verify, userController.user_profile);

//follow user
userRouter.post('/follow', jwtAuth.verify, userController.user_follow);

//get follower and following counts
userRouter.post('/follow-count', jwtAuth.verify, userController.user_follow_count);

//get follower user's details
userRouter.post('/followers', jwtAuth.verify, userController.user_followers);

//get following user's details
userRouter.post('/followings', jwtAuth.verify, userController.user_followings);

module.exports = userRouter;