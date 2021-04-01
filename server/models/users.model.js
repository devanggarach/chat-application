const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var usersSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    isOnline: { type: Boolean, default: false},
    isActive: { type: Boolean, default: true},
},{ versionKey: false, timestamps: true });
module.exports = mongoose.model("users", usersSchema);