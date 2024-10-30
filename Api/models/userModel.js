const mongoose = require("mongoose")
const uuid = require("uuid")
const Schema = mongoose.Schema

// *********USER MODEL******** //

const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String
    },
    messageId:{
        type:String,
        default:uuid.v4()
    },
})

const UserModel = mongoose.model("User",userSchema)

module.exports = {UserModel}