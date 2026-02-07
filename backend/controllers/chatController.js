import Chat from "../models/Chat.model.js"




// create controller for chat messages
export const createChat = async (req, res) => {
    try {
        const userId = req.user.id
        
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }

        const chat = await Chat.create(chatData)
        console.log(chat);
        
        res.json({success: true, message: "Chat created", chat})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


// api controller for getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user.id
        const chats = await Chat.find({userId}).sort({updatedAt: -1})
        
        res.status(200).json({success: true, chats})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// api controller for delete  chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user.id
        const {chatId} = req.body
        
        await Chat.deleteOne({_id: chatId, userId})
        res.json({success: true, message: "Chat Deleted"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getChatById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    console.log("chats: ", chat);
    
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
