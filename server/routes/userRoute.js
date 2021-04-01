const express = require("express");
const router = express.Router();
const userController=require("../controller/userController");
const formValidation= require("../validation/formValidation");

// '/login' is a path, formValidation.login is middleware, and userController.login is a controller
router.post('/login',formValidation.login,userController.login);
// '/signup' is a path, formValidation.login is middleware, and userController.signup is a controller
router.post('/signup',formValidation.signup,userController.signup);
// '/fetch/:id' is a path, and userController.fetchUsers is a controller
router.get('/fetch/:id',userController.fetchUsers);
// '/fetchUser/:id' is a path, and userController.fetchUserById is a controller
router.get('/fetchuser/:id',userController.fetchUserById);
router.post('/offline',userController.offline);
router.post('/online',userController.online);

module.exports=router;