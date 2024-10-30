const mongoose = require("mongoose")
const Schema = mongoose.Schema

/**
* sender => gönderici
* recipient => alıcı
* message => Metin
*/

const messageModel = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:String,
    isImage:Boolean,
    createAt:{
        type:Date,
        default:Date.now
    }
})


const MessageModel = mongoose.model("Message",messageModel)

module.exports ={MessageModel}