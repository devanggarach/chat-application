const chat = require("../dao/chat");

const chatting = {}

/*
chatting.message is used to store chatting data, we pass two argument value and respone callback,
so here we get all fields value of chatting in  value parameter,
then after chat.message function gets called which is in "../dao/chat"
once chat.message complete's its database operation,
it will return something but here we are not going to pass anything.
*/
chatting.message = (value,res) => {
    chat.message(value).then(result => {
    }).catch((e) => {})
}

/*
chatting.fetchRoom is used to fetch roomId is exist or not, we pass two argument request(req) and (res) respone callback,
so here we get all fields value of roomId in  req parameter,
then after chat.fetchRoom function gets called which is in "../dao/chat"
once chat.fetchRoom complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
chatting.fetchRoom = function(req, res){
    chat.fetchRoom(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

/*
chatting.fetchChats is used to fetch chats data, we pass two argument request(req) and (res) respone callback,
so here we get all fields values in  req parameter,
then after chat.fetchChats function gets called which is in "../dao/chat"
once chat.fetchChats complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
chatting.fetchChats = function(req, res){
    chat.fetchChats(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

// chatting.upload = function(req,res){
//     const storage = multer.diskStorage({
//         destination: "./public/uploads/",
//         filename: function(req, file, cb){
//            cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
//         }
//      });
//     chat.upload = multer({
//         storage: storage
//     }).single("myImage");
//     chat.upload(req).then(result => res.send(
//         { status: result.status, message: result.message }
//     )).catch( e => res.send({ status: e.status, message: e.message }))
// }

module.exports = chatting;