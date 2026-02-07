import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const profileSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, enum:["user","admin"], default: "user"},
    contactNumber: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tokenVersion: {type: Number, default: 0},
    lastSeen: {type: Date, default: Date.now},
    isBlocked: {type: Boolean, default: false}
    
}, {timestamps: true})

// Hash password before saving
profileSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return;
    
    this.password = await bcrypt.hash(this.password, 10)
})

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;