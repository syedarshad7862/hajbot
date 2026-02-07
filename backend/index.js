import express from 'express';
import "dotenv/config"
import cors from "cors"
import connectDB from './configs/db.js';
import userRouter from './routes/userRouter.js';
import chatRouter from './routes/chatRouter.js';
import adminRouter from "./routes/adminRouter.js"
import cookieParser from 'cookie-parser';

const app = express()
const port = 5000

await connectDB()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
origin: process.env.CLIENT_URL,
credentials: true
}))
app.options(/.*/, cors());



// Routes
app.get("/", (req, res) => {
    res.send("hello world!")
    // console.log("hello world");
})
app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/admin", adminRouter)


// app.listen(port, () => {
//     console.log(`Example app running on port: ${port}`);
    
// })
export default app;