export interface User {
  _id: string;
  email: string;
  fullName: string;
  role?: "admin" | "moderator" | "user";
  isBlocked?: boolean;
  lastSeen?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Chat {
  _id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ChatWithMessages {
  chat: Chat;
  messages: Message[];
}
