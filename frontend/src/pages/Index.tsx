import { useState, useCallback, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatArea from "@/components/chat/ChatArea";
import ChatInput from "@/components/chat/ChatInput";
import QuickActions from "@/components/chat/QuickActions";
import BottomNav from "@/components/chat/BottomNav";
import ChatSidebar from "@/components/chat/ChatSidebar";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useUserStatus } from "@/hooks/useUserStatus";
import { sendMessageApi } from "@/lib/chatApi";


const umrahPackages = [
  {
    title: "Umrah Economy",
    price: "₹85,000",
    duration: "10 Days",
    highlights: ["3-Star Hotels", "Shared Transport", "Guided Tours"],
  },
  {
    title: "Umrah Deluxe",
    price: "₹1,25,000",
    duration: "15 Days",
    highlights: ["4-Star Hotels", "Private Transport", "VIP Access"],
  },
  {
    title: "Umrah VIP",
    price: "₹1,95,000",
    duration: "20 Days",
    highlights: ["5-Star Hotels", "Private Suite", "Personal Guide"],
  },
];

const hajjPackages = [
  {
    title: "Hajj Standard",
    price: "₹3,50,000",
    duration: "21 Days",
    highlights: ["Tented Accommodation", "Group Transport", "All Meals"],
  },
  {
    title: "Hajj Premium",
    price: "₹5,50,000",
    duration: "25 Days",
    highlights: ["Hotel Stay in Makkah", "AC Tents in Mina", "Premium Services"],
  },
  {
    title: "Hajj Executive",
    price: "₹8,00,000",
    duration: "30 Days",
    highlights: ["5-Star Throughout", "Private Transport", "Exclusive Access"],
  },
];
/* ---------------- Page ---------------- */

const Index = () => {
  const navigate = useNavigate();

  /* -------- ALL HOOKS (NO RETURNS ABOVE THIS LINE) -------- */

  const { user, signOut, loading: authLoading } = useAuth();

  const {
    chats,
    messages,
    conversationId,
    loading: chatLoading,
    startNewChat,
    loadConversation,
    addMessage,
    removeChat,
  } = useChatHistory();

  const { isBlocked, blockMessage, updateLastSeen } = useUserStatus();
  const { toast } = useToast();

  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<{
    title: string;
    price: string;
    duration: string;
  } | null>(null);

  /* -------- Effects -------- */

  useEffect(() => {
    if (user && !isBlocked) {
      updateLastSeen();
    }
  }, [messages.length, user, isBlocked, updateLastSeen]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  /* -------- Callbacks (STILL HOOKS) -------- */

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

// const handleSendMessage = useCallback(
//   async (message: string) => {
//     if (!conversationId) {
//       await startNewChat();
//       return;
//     }

//     addMessage({ type: "user", content: message });
//     setIsTyping(true);

//     try {
//       await sendMessageApi(conversationId, message);

//       const startTime = Date.now();
//       const MAX_WAIT = 30_000;

//       const poll = setInterval(async () => {
//         await loadConversation(conversationId);

//         const hasAIReply = messagesRef.current.some(
//           (m) => m.type === "ai"
//         );

//         if (hasAIReply) {
//           clearInterval(poll);
//           setIsTyping(false);
//         }else{
//           console.log("ai response not get");
          
//         }

//         if (Date.now() - startTime > MAX_WAIT) {
//           clearInterval(poll);
//           setIsTyping(false);
//         }
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setIsTyping(false);
//     }
//   },
//   [conversationId, startNewChat, addMessage, loadConversation, messages]
// );

// const handleSendMessage = useCallback(
//   async (message: string) => {
//     let chatId = conversationId;

//     // ✅ Create chat AND continue
//     if (!chatId) {
//       chatId = await startNewChat();
//       if (!chatId) return;
//     }

//     // Optimistic user message
//     addMessage({ type: "user", content: message });
//     setIsTyping(true);

//     try {
//       const res = await sendMessageApi(chatId, message);

//       console.log("AI RESPONSE:", res);
//       const startTime = Date.now();
//       const MAX_WAIT = 30_000;

//       const poll = setInterval(async () => {
//         const updatedMessages = await loadConversation(chatId);

//         const hasAIReply = updatedMessages.some(
//           (m) => m.type === "ai"
//         );

//         if (hasAIReply) {
//           clearInterval(poll);
//           setIsTyping(false);
//         }

//         if (Date.now() - startTime > MAX_WAIT) {
//           clearInterval(poll);
//           setIsTyping(false);
//         }
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setIsTyping(false);
//     }
//   },
//   [conversationId, startNewChat, addMessage, loadConversation]
// );
const prevAiCountRef = useRef(0);
const pollRef = useRef<NodeJS.Timeout | null>(null);


const handleSendMessage = useCallback(
  async (message: string) => {
    let chatId = conversationId;

    if (!chatId) {
      chatId = await startNewChat();
      if (!chatId) return;
    }

    // Clear old poll
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    // Count AI messages BEFORE sending
    prevAiCountRef.current = messages.filter(
      (m) => m.type === "ai"
    ).length;

    // Optimistic user message
    addMessage({
      type: "user",
      content: message,
    });

    setIsTyping(true);

    try {
      await sendMessageApi(chatId, message);

      pollRef.current = setInterval(async () => {
        const updatedMessages = await loadConversation(chatId);

        const currentAiCount = updatedMessages.filter(
          (m) => m.type === "ai"
        ).length;

        // ✅ AI reply arrived
        if (currentAiCount > prevAiCountRef.current) {
          setIsTyping(false);

          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  },
  [conversationId, startNewChat, addMessage, loadConversation, messages]
);




  const handleQuickAction = useCallback(
    (action: string) => {
      const map: Record<string, string> = {
        umrah: "How many kinds of hajj?",
        hajj: "How to wear the Ihram?",
        hotel: "Which places I need to visit during Haj?",
        flight: "What is Tawaf?",
        packages: "What is Umrah?",
      };
      handleSendMessage(map[action] || "Help me with my booking");
    },
    [handleSendMessage]
  );

    const handleBookPackage = useCallback(
    (title: string) => {
      const allPackages = [...umrahPackages, ...hajjPackages];
      const pkg = allPackages.find((p) => p.title === title);

      if (pkg) {
        setSelectedPackage(pkg);
        addMessage({
          type: "notification",
          notification: {
            type: "success",
            message: `${title} added to your booking`,
          },
        });
        toast({
          title: "Package Selected",
          description: `${title} has been added to your booking summary.`,
        });
      }
    },
    [addMessage, toast]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/auth");
  }, [signOut, navigate]);

  /* -------- SAFE RETURNS (NO HOOKS BELOW) -------- */

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // navigation handled in useEffect
  }

  /* -------- Render -------- */

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        loading={chatLoading}
        currentConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewChat={startNewChat}
        onChatDeleted={removeChat}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-hidden relative">
        <ChatHeader
          user={user}
          onLogout={handleLogout}
          onNewChat={startNewChat}
          onOpenHistory={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        <ChatArea
          messages={messages}
          isTyping={isTyping}
          onQuickAction={handleQuickAction}
          onBookPackage={handleBookPackage}
        />

        {/* {messages.length > 0 && (
          <div className="border-t px-4 py-2">
            <QuickActions onAction={handleQuickAction} />
          </div>
        )} */}

        {/* Quick Actions Bar - Only show when there are messages */}
        {messages.length > 0 && (
          <div className="bg-card border-t border-border px-4 py-2 md:block">
            <div className="max-w-4xl mx-auto">
              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>
        )}

        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          isBlocked={isBlocked}
          blockMessage={blockMessage}
        />
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) =>
          tab === "home" ? navigate("/") : setActiveTab(tab)
        }
      />
    </div>
  );
};

export default Index;