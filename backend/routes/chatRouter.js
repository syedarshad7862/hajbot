import express, { Router } from "express"
import { createChat, deleteChat, getChats, getChatById } from "../controllers/chatController.js"
import { protect } from "../middlewares/auth.js"
import { aiWebhook, messageController } from "../controllers/messagesController.js"

const chatRouter = express.Router()

chatRouter.get("/create",protect, createChat)
chatRouter.get("/get",protect, getChats)
chatRouter.get("/get/:id", protect, getChatById);
chatRouter.post("/delete",protect, deleteChat)
chatRouter.post("/message", protect, messageController)
chatRouter.post("/webhook/ai", aiWebhook)

export default chatRouter