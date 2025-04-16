import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userPassword:{
        type:String,
        required:true
    }
})
const User = mongoose.model('User',userSchema)

export {User}