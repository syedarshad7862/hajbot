import Chat from "../models/Chat.model.js"
import axios from 'axios';



export const messageController = async (req, res) => {
    try {
        const userId = req.user.id
        const {chatId, prompt} = req.body

        if (!prompt || !chatId){
            return res.status(400).json({message: "chatId and prompt required"});
        }

        console.log("userId:", userId);
        console.log("chatId:", chatId);

        const chat = await Chat.findOne({userId, _id: chatId})
        console.log("this is from messageController:",chat);
        
        if(!chat){
            return res.status(404).json({message: "chat not found"})
        }

        // Save user message
        chat.messages.push({
            role: "user",
             content: prompt,
             timestamp: Date.now()
        })

        // 2️⃣ INSERT PENDING AI MESSAGE
        // chat.messages.push({
        //     role: "ai",
        //     content: "__PENDING__",
        //     status: "pending",
        //     timestamp: Date.now(),
        // });
        await chat.save()

        // take last 6-8 messages only

        // const recentMessages = chat.messages
        //   .slice(-6)
        //   .map(m => ({
        //     role: m.role === "ai" ? "assistant" : "user",
        //     content: m.content
        //   }))

        // console.log("recent chats: ", recentMessages);
        
        // send to n8n (async)
        await axios.post(process.env.N8N_INPUT_WEBHOOK, {
            thread_id: chatId,
            user_id: userId.toString(),
            message: prompt
        })

        return res.status(200).json({success: true})
    } catch (error) {
        console.error("Send message error:", error)
        return res.status(500).json({success: false, message: error.message})
    }
}


// export const aiWebhook = async (req, res) => {
//   try {
//     const secret = req.headers["x-webhook-secret"];

//     if (secret !== process.env.N8N_SECRET) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { chatId, content } = req.body;
//     if (!chatId || !content) {
//       return res.status(400).json({ message: "Invalid payload" });
//     }

//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // 🔍 Find pending AI message
//     const pendingMessage = chat.messages.find(
//       (m) => m.role === "ai" && m.content === "__PENDING__"
//     );

//     if (!pendingMessage) {
//       return res.status(409).json({ message: "No pending AI message found" });
//     }

//     // ✅ Update placeholder
//     pendingMessage.content = content;
//     pendingMessage.status = "done";
//     pendingMessage.timestamp = Date.now();

//     await chat.save();

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("AI webhook error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const aiWebhook = async (req, res) => {
//   try {
//     const secret = req.headers["x-webhook-secret"];

//     if (secret !== process.env.N8N_SECRET) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const { chatId, content } = req.body;
//     if (!chatId || !content) {
//       return res.status(400).json({ message: "Invalid payload" });
//     }

//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // 🔍 Find pending AI message
//     const pendingMessage = chat.messages.find(
//       (m) => m.role === "ai" && m.content === "__PENDING__"
//     );

//     if (!pendingMessage) {
//       return res.status(409).json({ message: "No pending AI message found" });
//     }

//     // ✅ Update placeholder
//     pendingMessage.content = content;
//     pendingMessage.status = "done";
//     pendingMessage.timestamp = Date.now();

//     await chat.save();

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("AI webhook error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


export const aiWebhook = async (req, res) => {
    try {
        const secret = req.headers['x-webhook-secret'];

        if (secret !== process.env.N8N_SECRET){
            return res.status(401).json({success: false,message: "Unautharized"})
        }

        const {chatId, content} = req.body;

        if (!chatId || !content) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Save AI message
        chat.messages.push({
            role: "ai",
            content,
            timestamp: Date.now()
        });

        await chat.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("AI webhook error message:", error)
        return res.status(500).json({success: false, message: error.message})
    }
}