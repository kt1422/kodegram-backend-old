const router = require('express').Router();
const chatController = require("../controller/chatController");
const jwtAuth = require('../utils/jwtAuth');

//get messages
router.post('/getMessage', jwtAuth.verify, chatController.getMessage);

//send messages
router.post('/sendMessage', jwtAuth.verify, chatController.sendMessage);

//get convo that user chats with
router.post('/getConvo', jwtAuth.verify, chatController.getConvo);

module.exports = router;