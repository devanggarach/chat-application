const usersModel = require("../models/users.model");
var ObjectID = require('mongodb').ObjectID;

const secure = require("../config/secure");

const user = {}

/*
user.signup is called by userController.signup to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will find if any user is already exist with username or email, then it will return promise rejected, with message and status code,
else it will give response resolve with message and status code.
*/
user.signup = (req) => {
    return new Promise((resolve, reject) => {
        let userDetail = new usersModel(req.body);
        let email = userDetail.email.toLowerCase();
        let username = userDetail.username.toLowerCase();
        usersModel.aggregate([
            { $match: { $or: [{ email: email },{ username: username }] } },
            { $project: { _id: 0, username: 1, email: 1 } }
        ]
        ).exec((err,result) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            if(result.length === 0){
                userDetail.save((err, userSaved) => {
                    if(err) throw err;
                    else{
                        resolve({ status:200, message:"user save successfully" })
                    }
                })
            }
            else{
                reject({ status: 400, message: "user already exist" })
            }
        })
    })
}

/*
user.login is called by userController.login to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will find if any user is already exist and match the username and password if its correct, then it will return response resolve, with message and status code,
else it will give response rejected with message and status code.
*/
user.login = (req) => {
    return new Promise((resolve, reject) => {
        let userDetail = new usersModel(req.body);
        let username = userDetail.username.toLowerCase();
        let password = userDetail.password;
        
        usersModel.aggregate([
            {
                $match:{ username: userDetail.username }
            },
            {
                $project:{ _id: 1, password: 1, username: 1 }
            }
        ]).exec((err, result) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else if(result.length != 0){
                resultObj = {
                    _id: result[0]._id,
                    username: result[0].username
                }
                if(result[0].password == userDetail.password){
                    resolve({ status: 200, message: resultObj });
                }
                else{
                    reject({ status: 401, message: "please, check your username & password" })
                }
            }
            else{
                reject({ status: 401, message: "please, check your username & password" })
            }
            if(err){
                reject({ status: 500, messsage: "internal server error" });
            }
            if(result.length){
                resolve({ status: 200, message: result[0] });
            }
            else{
                reject({ status: 401, message: "please, check your username & password" })
            }
        });
    })
}

/*
user.fetchUSers is called by userController.fetchUsers to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will fetch all users except current logged-in user, if any results, then it will return response resolve, with message and status code,
else it will give response rejected with message and status code.
*/
user.fetchUsers=(req) => {
    // fetching users other than loggedin
    return new Promise((resolve, reject) => {
        var id = req.params.id;
        usersModel.aggregate([
            {
                $match: { _id: { $nin: [ObjectID(id)] } }
            },
            {
                $project: { _id: 1, username: 1, fname: 1, lname: 1, isOnline: 1, updatedAt: 1 }
            }
        ]).exec((err, result) => {
            if(err){
                reject({ status: 500, messsage: "internal server error" });
            }
            if(result.length === 0){
                reject({ status: 401, message: "no user found" });
            }
            else{
                resolve({ status: 200, message: result });
            }
        });
    })
}

/*
user.fetchUserById is called by userController.fetchUserById to perform database operations,
here we pass one argument req(request), to get all fields data which are passed from client machine,
and we return the promise, inside promise , it have arumgents resolve and reject,
here it will fetch user is exist then it will return its name in result, if any result, then it will return response resolve, with message and status code,
else it will give response rejected with message and status code.
*/
user.fetchUserById=(req) => {
    return new Promise((resolve, reject) => {
        var id = req.params.id;
        usersModel.aggregate([
            {
                $match: { _id: ObjectID(id) }
            },
            {
                $project: { _id: 1,username: 1 }
            }
        ]).exec((err, result) => {
            if(err){
                reject({ status: 500, messsage: "internal server error" });
            }
            if(result.length === 0){
                reject({ status: 401, message: "no user found" });
            }
            else{
                resolve({ status: 200, message: result });
            }
        });
    })
}

/* 
user offline called when user close tab or logout from chat application, at that time socket will pass senderId
and base on senderId we set boolean value to false for showing user offline 
*/
user.offline = (value) => {
    var id = value.senderId;
    return new Promise((resolve, reject) => {
        usersModel.updateOne({ _id: ObjectID(id)},{ isOnline: false}).exec((err, userOnline) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else{
                resolve({ status: 200, message: "user offline" });
            }
        })
    })
}

/*
user online function called when user signin or user return back via opening tab, at that time socket will pass senderId
and using senderId we set boolean value true to show user online
*/
user.online = (value) => {
    var id = value.senderId;
    return new Promise((resolve, reject) => {
        usersModel.updateOne({ _id: ObjectID(id)},{ isOnline: true }).exec((err, userOnline) => {
            if(err){
                reject({ status: 500, message: "internal server error" });
            }
            else{
                resolve({ status: 200, message: "user online" });
            }
        })
    })
}
module.exports = user