import express from 'express'
import { getAllUsets, getUser, loginUser, logoutUser, registerUser } from '../controllers/profileController.js';
import { protect } from '../middlewares/auth.js';



const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)
userRouter.get("/data", protect,getUser)
userRouter.get("/users", protect,getAllUsets)


export default userRouter