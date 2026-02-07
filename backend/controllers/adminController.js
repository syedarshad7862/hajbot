import bcrypt from "bcryptjs";
import Profile from "../models/Profile.model.js"
import jwt from 'jsonwebtoken'
import Chat from "../models/Chat.model.js";

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
         {
        expiresIn: '7d'
    })
}

export const adminLogin = async(req, res) => {
    const {email, password} = req.body;
    try {
        const admin = await Profile.findOne({email, role: "admin"});
        if(!admin) return res.status(401).json({success: false, message: "Not an Admin!"})

        // match password
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) return res.status(401).json({success: false, message: "invalid credentials"});

        const token = generateToken(admin)

        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({success: true, admin})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const adminDashboard = async(req, res) => {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const totalUsers = await Profile.countDocuments({role: "user"});
    const activeUsers = await Profile.countDocuments({
        role: "user",
        lastSeen: {$gte: tenMinutesAgo}
    });
    // console.log(req.user);
    const inactiveUsers = await Profile.countDocuments({
        role: "user",
        lastSeen: {$lt: tenMinutesAgo}
    });

    const totalChatsToday = await Chat.countDocuments({
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
    });

    return res.status(200).json({
        succes: true,
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalChatsToday
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const blockUser = async(req, res) => {
    try {
        const {userId} = req.params;
        const {block} = req.body // false and ture

        const user = await Profile.findOne({ _id: userId, role: "user" });

        console.log("user req:", userId, block);
        if(!user) return res.status(404).json({
            success: false,
            message: "User not found"
        });
        
        user.isBlocked = block
        user.tokenVersion += 1
        await user.save();

        return res.status(200).json({
            success: true,
            message: block ? "User blocked Successfully" : "User Unblock Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

