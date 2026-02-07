import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "Profile", required: true},
    userName: {type: String, required: true},
    name: {type: String, required: true},
    messages: [
        {
            role: {type: String, enum: ["user", "ai"], required: true},
            content: {type: String, required: true},
            timestamp: {type: Number, required: true}
        }
    ]
    
},{timestamps: true})


const Chat = mongoose.model("Chat",chatSchema)

export default Chat;