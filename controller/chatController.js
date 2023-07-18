const Chat = require("../model/chatModel");
const User = require('../model/userModel');
const Convo = require('../model/convoModel');
const { checkDate, chatDate } = require('../utils/checkDate');

const getConvo = async (req, res) => {
    const userId = req.getUser.id;
    if(userId){
        const rawChatUsers = await Convo.find({
            $or:[ 
                {sender: userId},
                {recipient: userId}
            ]
        }).sort({lastDate: -1});
        const chatUsers = [];
        for(let data of rawChatUsers){
            const user = (data.sender==userId) ? data.recipient : data.sender;
            const userDetails = await User.findOne({_id: user});
            // const chats = await Chat.findOne({convo: data._id}).sort({created_at: -1});
            const obj = {
                user_id: user,
                username: userDetails.username,
                fname: userDetails.fname,
                pic: userDetails.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                convo: data._id,
                lastMessage: data.lastMessage,
                lastDate: checkDate(data.lastDate),
                lastSender: data.lastSender
            }
            chatUsers.push(obj);
        }
        res.send({
            status: "success",
            message: "Got all users you chat with",
            chatUsers
        });
    } else {
        res.send({status: "error", msg: "No user"});
    }
}

const getMessage = async (req, res) => {
    const userId = req.getUser.id;
    const convo = req.body.convo
    if(userId){
        const rawMessages = await Chat.find({convo: convo});
        const allMessages = [];
        for(let message of rawMessages){
            const obj = {
                sender: message.sender,
                recipient: message.recipient,
                convo: message.convo,
                message: message.message,
                isRead: message.isRead,
                date: chatDate(message.createdAt)
            }
            allMessages.push(obj);
        }
        res.send({
            status: "success",
            message: "Got all your messages",
            allMessages
        });
    } else {
        res.send({status: "error", msg: "No user"});
    }
}

const sendMessage = async (req, res) => {
    const userId = req.getUser.id;
    const recipientId = req.body.recipient;
    let convoId = req.body.convo;
    if(userId){
        if(convoId==""){
            const newConvo = new Convo({
                sender: userId,
                recipient: recipientId,
                lastMessage: "",
                lastDate: "",
                lastSender: ""
            });
            convoId = newConvo._id
            await newConvo.save();
        }
        
        const newChat = new Chat({
            sender: userId,
            recipient: req.body.recipient,
            convo: convoId,
            message: req.body.message,
            isRead: false
        });
        await newChat.save();

        const updateConvo = await Convo.findByIdAndUpdate(convoId, {
            lastMessage: newChat.message,
            lastDate: newChat.createdAt,
            lastSender: userId
        });

        const logUser = await User.findOne({_id: userId});
        res.send({
            status: "success",
            message: "Your message has sent successfully!",
            newChat : {
                sender: newChat.sender,
                fname: logUser.fname,
                pic: logUser.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                recipient: newChat.recipient,
                message: newChat.message,
                convo: newChat.convo,
                date: chatDate(newChat.createdAt)
            }
        });
    } else {
        res.send({status: "error", msg: "No user"});
    }
}

module.exports = {
    getConvo,
    getMessage,
    sendMessage
}