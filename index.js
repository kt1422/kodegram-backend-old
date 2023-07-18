//import modules
const express = require('express');
const app = express();
require('dotenv').config();
const dbConnect = require('./db_config/db_connect');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const chatRouter = require('./routes/chatRouter');
const socket = require("socket.io");

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//connect and check db connection
dbConnect();

//routes
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/chat', chatRouter);

//check port connection
const port = process.env.PORT || 8080;
const server = app.listen(port, ()=>{
    console.log(`server is now running in port:${port}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
  
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data);
        }
    });
});