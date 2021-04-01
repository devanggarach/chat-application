const express = require("express");
const app = require("../app");

const router = express.Router();
const userRoute = require("./userRoute");
const chatRoute = require("./chatRoute");

// here all routing file are defined
module.exports = function(app){
    router.use(userRoute);
    router.use(chatRoute);
    app.use("",router);
}