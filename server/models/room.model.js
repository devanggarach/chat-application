const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var roomSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
},{ versionKey: false, timestamps: true });
module.exports = mongoose.model("room", roomSchema);