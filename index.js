//import modules
const express = require('express');
const app = express();
require('dotenv').config();
const dbConnect = require('./db_config/db_connect');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//connect and check db connection
dbConnect();

//routes
app.use('/user', userRouter);
app.use('/post', postRouter);

//check port connection
const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log(`server is now running in port:${port}`);
});