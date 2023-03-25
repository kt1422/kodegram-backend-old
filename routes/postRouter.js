const postRouter = require('express').Router();
const postController = require('../controller/postController');
const jwtAuth = require('../utils/jwtAuth');

//add post
postRouter.post('/add', jwtAuth.verify, postController.post_add);

//delete post
postRouter.post('/delete', jwtAuth.verify, postController.post_delete);

//edit post
postRouter.post('/edit', jwtAuth.verify, postController.post_edit);

//get all posts for home
postRouter.post('/home-posts', jwtAuth.verify, postController.post_home);

//get all posts for home
postRouter.post('/profile-posts', jwtAuth.verify, postController.post_profile);

//like or unlike post
postRouter.post('/like', jwtAuth.verify, postController.post_like);

//get likers
postRouter.post('/get-likers', jwtAuth.verify, postController.post_likers);

//add comment
postRouter.post('/add-comment', jwtAuth.verify, postController.comment_add);

//get comment
postRouter.post('/get-comment', jwtAuth.verify, postController.comment_get);

module.exports = postRouter;