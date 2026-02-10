import api from "@/lib/api"; // axios instance with withCredentials=true

export const createChatApi = async () => {
  const res = await api.get("/chat/create");
  console.log("response of createChatApi", res);
  
  return res.data.chat;
};

export const getChatsApi = async () => {
  const res = await api.get("/chat/get");
  return res.data.chats;
};

export const getChatByIdApi = async (chatId: string) => {
  const res = await api.get(`/chat/get/${chatId}`);
  console.log("hello from get chat api", res.data.chat);
  
  return res.data.chat;
};

export const sendMessageApi = async (
  chatId: string,
  prompt: string
) => {
  const res = await api.post("/chat/message", {
    chatId,
    prompt,
  });
  return res.data
};

/* ✅ ADD THIS */
export const deleteChatApi = async (chatId: string) => {
  const res = await api.post("/chat/delete", {
    chatId,
  });
  return res.data; // { success: true }
};
