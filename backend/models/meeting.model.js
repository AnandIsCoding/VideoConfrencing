import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    user_id:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    meetingCode:{
        type:String,
        required:true
    }
})

const Meeting = mongoose.model('Meeting',meetingSchema)

export {Meeting}