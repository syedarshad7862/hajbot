import Profile from "../models/Profile.model.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion
        },
        process.env.JWT_SECRET,
         {
        expiresIn: '7d'
    })
}


// API to register user
export const registerUser = async (req,res) => {
    const {name,email, password, agencyName, contactNumber} = req.body

    try {
        const userExists = await Profile.findOne({email})
        if(userExists){
            return res.json({success: false, message: "User already exists"})
        }

        const user = Profile.create({name,email,password, agencyName,contactNumber})

        const token = generateToken(user)
        
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({success: true, message: "User Register Successfully."})
        // res.json({success: true, token})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// API to login user
export const loginUser = async (req,res) => {
    const {email, password} = req.body;

    try {
       const user = await Profile.findOne({email}).select("+ password role email tokenVersion isBlocked")
        if(!user){
            return res.status(401).json({success: false, message: 'Invalid email or password'})

        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({success: false, message: 'Invalid email or password'})
        }
        if (user.isBlocked) return res.status(401).json({success: false, message: "You are blocked by admin. Please contact with Administrator."});

        const token = generateToken(user)
        console.log("tokenVersion from login controller", user.tokenVersion);
        
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({success: true, user,})
        // return res.json({success: true, token})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}

// get all users
export const getAllUsets = async (req, res) => {
    try {
        const users = await Profile.find({role: "user"}).select("email isBlocked lastSeen agencyName");

        return res.status(201).json({success: true, users: users})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}
// API to get user data
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({success: true, user})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ success: true });
};
