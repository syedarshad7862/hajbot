import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import PackageCard from "./PackageCard";
import TypingIndicator from "./TypingIndicator";
import SystemNotification from "./SystemNotification";
import QuickActions from "./QuickActions";
import salaamhajilogo from "/favicon.png"

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

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onQuickAction: (action: string) => void;
  onBookPackage: (title: string) => void;
  loading?: boolean
}

const ChatArea = ({ messages, isTyping, onQuickAction, onBookPackage, loading }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (loading) {
  return (
    <div className="flex-1 flex items-center justify-center bg-chat-bg">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 animate-pulse">
          <span className="text-2xl">🕋</span>
        </div>
        <p className="text-muted-foreground text-sm">Loading your chats...</p>
      </div>
    </div>
  );
}

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-chat-bg px-4 py-4 pb-32 md:pb-4"
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-25 h-20 rounded-full mb-4 shadow-soft">
              {/* <span className="text-3xl">🕋</span> */}
              <img src={salaamhajilogo} alt="salaam haji" className="w-full h-full object-cover rounded-full" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Assalamu Alaikum!
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Welcome to Salaam Haji. I am your AI assistant for Hajj and Umrah
              guidance. Ask me about rituals, duas, rules, and step-by-step
              instructions.
            </p>
            <QuickActions onAction={onQuickAction} />
          </div>
        )}

        {messages.map((message) => {
          if (message.type === "notification" && message.notification) {
            return (
              <SystemNotification
                key={message.id}
                type={message.notification.type}
                message={message.notification.message}
              />
            );
          }

          if (message.type === "packages" && message.packages) {
            return (
              <div key={message.id} className="space-y-3 animate-fade-in">
                <MessageBubble
                  content="Here are some packages for you:"
                  isUser={false}
                  timestamp={message.timestamp}
                />
                {message.packages.map((pkg, index) => (
                  <PackageCard
                    key={index}
                    title={pkg.title}
                    price={pkg.price}
                    duration={pkg.duration}
                    highlights={pkg.highlights}
                    onBookNow={() => onBookPackage(pkg.title)}
                  />
                ))}
              </div>
            );
          }

          return (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.type === "user"}
              timestamp={message.timestamp}
            />
          );
        })}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};

export default ChatArea;