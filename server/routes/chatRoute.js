const express = require("express");
const router = express.Router();
const chatController=require("../controller/chatController");
const chat = require("../dao/chat");

// '/fetchroom' is a path and chatController.fechRoom is a controller
router.post('/fetchroom',chatController.fetchRoom);
// '/fetchchats' is path and chatController.fetchChats is a controller
router.post('/fetchchats',chatController.fetchChats);
router.post('/upload',chat.upload);


module.exports=router;