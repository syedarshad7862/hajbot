import express from "express"
import {adminDashboard, adminLogin, blockUser} from "../controllers/adminController.js"
import {protect, adminOnly} from "../middlewares/auth.js"

const adminRouter = express.Router();

adminRouter.post("/adminLogin", adminLogin);
adminRouter.get("/dashboard", protect,adminOnly,adminDashboard);
adminRouter.patch("/:userId/block", protect,adminOnly,blockUser);

export default adminRouter