const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var chatSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    message: { type: String, required: false },
    fileURL: { type: String, required: false },
    receiverId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    roomId: { type: String, required: true, ref: 'room' }
},{ versionKey: false, timestamps: true });
module.exports = mongoose.model("chat", chatSchema);