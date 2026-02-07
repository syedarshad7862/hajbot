import jwt from "jsonwebtoken";
import Profile from "../models/Profile.model.js";


export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("Cookies:", req.cookies);

        // console.log(token);
        if (!token) return res.status(401).json({ success: false, message: "unAuthorized Request"})
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    
        const user = await Profile.findById(decodedToken.id).select("_id name role isBlocked tokenVersion");
    
        if (!user) {
           return res.status(401).json({success: false, message: "Invalid Access Token"})
        }
        console.log("✅middleware triggered", "tokenVersion: ", user.tokenVersion, decodedToken.tokenVersion, user._id);

        // full block check
        if (user.isBlocked) return clearAndReject(
                res,
                "You are blocked by admin. Please contact with Administrator."
            )

        // JWT Invalidation check
        if (decodedToken.tokenVersion !== user.tokenVersion) return clearAndReject(
                res,
                "Session Expired. Please login again."
            )
        req.user = {
            id: user._id,
            role: user.role,
            name: user.name
        };

        // Update lastSeen (for active users tracking)
        await Profile.findByIdAndUpdate(user._id, {
            lastSeen: new Date()
        });

        next()
    } catch (error) {
        console.error("AUTH ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    
}

export const adminOnly = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Admin access only"});
    }
    next()
}

// helper function to clear jwt and reject user
const clearAndReject = (res, message) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.Node_ENV === "production" ? "none" : "lax",
        secure: process.env.Node_ENV === "production"
    })

    return res.status(401).json({
        success: false,
        message
    })
}