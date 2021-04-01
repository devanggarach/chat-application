
const user = require("../dao/user")

const userController = {};

/*
userController.signup is used to store user registration data, we pass two argument request(req) and (res) respone callback,
so here we get all fields values in  req parameter by req.body.*,
then after chat.signup function gets called which is in "../dao/user"
once user.signup function complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
userController.signup = function(req, res){
    user.signup(req, res).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

/*
userController.login is used to authorized user to logged-in, we pass two argument request(req) and (res) respone callback,
so here we get all fields values in  req parameter by req.body.*,
then after user.login function gets called which is in "../dao/user"
once user.signin function complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
userController.login = function(req, res){
    user.login(req, res).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

/*
userController.fetchUsers is used to fetch all users exept currretn user logged-in, we pass two argument request(req) and (res) respone callback,
so here we get all fields values in  req parameter,
then after user.fetchUsers function gets called which is in "../dao/user"
once user.fetchUsers function complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
userController.fetchUsers = function(req, res){
    user.fetchUsers(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

/*
userController.fetchUserById is used to fetch username by user Id, we pass two argument request(req) and (res) respone callback,
so here we get all fields values in  req parameter,
then after user.fetchUserById function gets called which is in "../dao/user"
once user.fetchUserById function complete's its database operation,
and then will return result value, else it will goes into catch block to return value
*/
userController.fetchUserById = function(req, res){
    user.fetchUserById(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

userController.offline = function(req, res){
    user.offline(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}

userController.online = function(req, res){
    user.online(req).then(result => res.send(
        { status: result.status, message: result.message }
    )).catch(e => res.send({ status: e.status, message: e.message }))
}
module.exports = userController;