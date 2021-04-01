const chatModel = require("../models/chat.model");
const roomModel = require("../models/room.model");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mime = require("mime");
var ObjectID = require('mongodb').ObjectID;
const secure = require("../config/secure");

var chat = {}

/*
chat.message is called by chatController.message to perform database operations,
here we pass one argument value, to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
once we data is inserted success fully then it will resolve with message and status code,
else it will rejected with message and status code.
*/
chat.message = (value) => {
    return new Promise((resolve, reject) => {
        chatDetail = new chatModel({
            senderId: value.senderId,
            message: value.message,
            receiverId: value.receiverId,
            roomId: value.roomId
        });
        chatDetail.save((err, savedResult) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else{
                resolve({ status: 200,message: savedResult });
            }
        })
    })
}

/*
when user send file at that time it will send base64 format string, and here it will be coverted to original form
base64 to original file, and keep that file into public/ uploads/roomId folder, and at last it will make entry into database
 */
chat.file = (value) => { 
    const fileContents = new Buffer(value.file.base64, 'base64')
    const dir = "./public/uploads/" + value.roomId + "/";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    var matches = value.file.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    response = {};
    
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;

    fs.writeFileSync(dir + value.file.name, imageBuffer, 'utf8');
    
    return new Promise((resolve, reject) => {
        chatDetail = new chatModel({
            senderId:value.senderId,
            fileURL: secure.encrypt(value.file.name),
            receiverId: value.receiverId,
            roomId: value.roomId
        })
        chatDetail.save((err, savedResult) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else{
                resolve({ status: 200, message: savedResult})
            }
        })
    })
}

/*
when user send file and message both at same time at that time first we convert file base64 to original file
and then after we keep that file into public/uploads/roomId folder and make entry into database
*/
chat.fileMessage = ( value ) => {
    const fileContents = new Buffer(value.file.base64, 'base64')
    const dir = "./public/uploads/" + value.roomId + "/";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    var matches = value.file.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    response = {};
    
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    fs.writeFileSync(dir + value.file.name, imageBuffer, 'utf8');
    
    return new Promise((resolve, reject) => {
        chatDetail = new chatModel({
            senderId: value.senderId,
            message: value.message,
            fileURL: secure.encrypt(value.file.name),
            receiverId: value.receiverId,
            roomId: value.roomId
        })
        chatDetail.save((err, savedResult) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else{
                resolve({ status: 200, message: savedResult})
            }
        })
    })
}
/*
chat.fetchRoom is called by chatController.fetchRoom to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will find both roomId, if any one are matched, then it will return response, with message and status code,
else it will rejected with message and status code.
*/
chat.fetchRoom=(req)=>{
    return new Promise((resolve,reject)=>{
        roomModel.aggregate([
            {
                $match:{ $or:[{ senderId: ObjectID(req.body.senderId), receiverId: ObjectID(req.body.receiverId) },{ senderId: ObjectID(req.body.receiverId), receiverId: ObjectID(req.body.senderId) }] }
            },
            {
                $project:{ _id: 1 }
            }
        ]).exec((err, result) => {
            if(err){
                reject({ status: 500, messsage: "internal server error" });
            }
            if(result.length === 0){
                roomDetail = new roomModel({
                    senderId: req.body.senderId,
                    receiverId: req.body.receiverId,
                });
                roomDetail.save((err, saveRoom)=>{
                    if(err){
                        reject("internal server error");
                    }else{
                        resolve({ status: 201, message: saveRoom._id })
                    }
                })
            }else{
                resolve({ status: 200, message: result[0]._id });
            }
        });
    })
}

/*
chat.fetchChats is called by chatController.fetchChats to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will find if any chat having in roomId, then it will return response resolve, with message and status code,
else it will rejected with message and status code.
*/
chat.fetchChats=(req) => {
    const roomId = req.body.roomId;
    return new Promise((resolve, reject) => {
        chatModel.aggregate([
            {
                $match:{ roomId: roomId }
            }
        ]).exec((err, result) => {
            if(err){
                reject({ status: 500, messsage: "internal server error" });
            }
            if(result.length === 0){
                reject({ status: 404, message: result});
            }else{
                resolve({ status: 200, message: result });
            }
        });
    })
}

/*
this upload function will works with request file sent from form, and it saves file using multer.
*/
chat.upload = (req, res) => {
        const storage = multer.diskStorage({
            destination: "./public/uploads/",
            filename: function(req, file, cb){
               cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
            }
         });
         const upload = multer({
            storage: storage
        }).single("myImage");
        upload(req, res, (err) => {
            /*Now do where ever you want to do*/
            if(!err){
                return res.send(200).end();
            }
            else{
                return res.send(500).end();
            }  
         });
}

module.exports = chat;