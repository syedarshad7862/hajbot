import { useState, useEffect, useCallback } from "react";
import {
  createChatApi,
  getChatsApi,
  getChatByIdApi,
} from "@/lib/chatApi";
import { Chat } from "@/types";
import axios from "axios";

export interface Message {
  id: string;
  type: "user" | "ai" | "packages" | "notification";
  content?: string;
  packages?: Array<{
    title: string;
    price: string;
    duration: string;
    highlights?: string[];
  }>;
  notification?: {
    type: "success" | "pending" | "error" | "info";
    message: string;
  };
  timestamp: string;
}

export const useChatHistory = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ---------- LOAD CHATS ---------- */

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getChatsApi();

        // ✅ SANITIZE
        const safeChats = Array.isArray(data)
          ? data.filter((c) => c && c._id)
          : [];

        setChats(safeChats);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* -------- 🔥 THIS IS loadConversation -------- */
  const loadConversation = useCallback(async (chatId: string) => {
    const chat = await getChatByIdApi(chatId);

    const formatted = chat.messages.map(m => ({
    id: `${chatId}-${m.timestamp}`,
    type: m.role === "ai" ? "ai" : "user",
    content: m.content,
    timestamp: new Date(m.timestamp).toLocaleTimeString(),
  }));

    setConversationId(chat._id);
    // setMessages(chat.messages || []);
    setMessages(formatted || []);

    // return chat.messages?.length || 0;
    return formatted;
  }, []);

  /* ---------- NEW CHAT ---------- */

  const startNewChat = useCallback(async () => {
    const chat = await createChatApi();
    if (!chat || !chat._id) {
      throw new Error("Chat creation failed");
    }

    // await fetchUsersChat()
    setChats((prev) => [chat, ...prev]);
    setConversationId(chat._id);
    setMessages([]);

    return chat._id;
  }, []);


  const fetchUsersChat = async () => {
    try {
      const {data} = await getChatsApi();

      if(data.success){
        setChats(data.chats)
        // if the user has no chats, create one
        if(data.chats.length === 0){
          await startNewChat()
          return fetchUsersChat()
        }else{
          setConversationId(data.chats[0]);
        }
      }else{
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }


  /* ---------- ADD MESSAGE ---------- */

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const msg: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: formatTime(Date.now()),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  /* ---------- DELETE CHAT ---------- */

  const removeChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((c) => c?._id !== chatId));

    if (conversationId === chatId) {
      setConversationId(null);
      setMessages([]);
    }
  }, [conversationId]);

  return {
    chats,
    messages,
    conversationId,
    loading,
    startNewChat,
    loadConversation,
    addMessage,
    removeChat,
  };
};