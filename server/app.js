const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToDB = require("./config/connectToDB");
const chat=require("./dao/chat");
const user = require("./dao/user");
const secure = require("./config/secure");
const io = require('socket.io').listen(server, {'transports': ['websocket', 'polling']})
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'))
app.use('/uploads', express.static('public'))

// const app = require('express')()
// const server = require('http').createServer(app)

// checking that .env file is getting or not, to get value from .env file, we make sure that dotenv module installed.
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	require("dotenv").config();
	if (!process.env.PORT) {
		console.error('Required environment variable not found. Are you sure you have a ".env" file in your application root?');
		console.error('If not, you can just copy "example.env" and change the defaults as per your need.');
		process.exit(1);
	}
}

connectToDB.mongodb();

io.on('connection', socket => {
  socket.on('isOnline', ( value ) => {
    if(value.isOnline === true){
      user.online(value)
      io.emit("isOnline", ( { senderId: value.senderId, isOnline: true }) )
    }
    else{
      user.offline(value)
      io.emit("isOnline", ( { senderId: value.senderId, isOnline: false }) )
    }

  })

  socket.on('message', ( value ) => {
    let roomId = value.roomId;
    socket.join(value.roomId);
    
    if(Object.keys(value).length == 1){
      io.to(roomId).emit('message2', null );
    }
    else{
      if(value.hasOwnProperty("message") && value.hasOwnProperty("file")){
        chat.fileMessage(value).then(result => {
          io.to(roomId).emit('message2', (result.message) )
        }).catch((e) => {})
      }else if(value.hasOwnProperty("message")){
        chat.message(value).then(result => {
          io.to(roomId).emit('message2', (result.message) )
        }).catch((e) => {})
      }else{
        chat.file(value).then(result => {
          io.to(roomId).emit('message2', (result.message) )
        }).catch((e) => {})
      }
    }

  })

})

require("./routes/index")(app);
server.listen(process.env.PORT, function() {
  console.log('server runs on http://localhost:' + process.env.PORT)
});
module.exports = app