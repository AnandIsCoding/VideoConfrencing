import { Schema } from "mongoose";

const meetingSchema = new Schema({
    meeting_id:{
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