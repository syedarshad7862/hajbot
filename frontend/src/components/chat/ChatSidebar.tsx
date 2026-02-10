import { useState, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Check,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Chat } from "@/types";
import {deleteChatApi} from "@/lib/chatApi";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats?: Chat[];          // optional for safety
  loading?: boolean;       // optional for safety
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onChatDeleted?: (chatId: string) => void;
}



const ChatSidebar = ({
  isOpen,
  onToggle,
  chats = [],
  loading = false,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onLogin,
  onLogout,
  onChatDeleted
}: ChatSidebarProps) => {
  const { user } = useAuth();
  console.log("SIDEBAR CHATS:", chats);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

const handleDelete = async (e: React.MouseEvent, chatId: string) => {

  try {
    e.stopPropagation();

    const confirm = window.confirm("Are you sure you want to delete this Chat?");

    if(!confirm) return;
    await deleteChatApi(chatId);

    onChatDeleted?.(chatId);

    if (currentConversationId === chatId) {
      await onNewChat();
    }
  } catch (err) {
    console.error("Delete chat failed", err);
  }
};




  const handleStartEdit = (e: React.MouseEvent, conv: Chat) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }

    // UI-only for now (backend API can be added later)
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit(e as unknown as React.MouseEvent);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative left-0 top-0 h-full z-50 md:z-auto flex flex-col",
          "bg-sidebar-background border-r border-sidebar-border",
          "transition-all duration-300",
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:translate-x-0 md:w-0"
        )}
      >
        <div
          className={cn(
            "flex flex-col h-full w-64",
            !isOpen && "invisible md:visible"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 p-3 border-b border-sidebar-border">
            <Button
              onClick={onNewChat}
              className="flex-1 justify-start gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              New chat
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <PanelLeftClose className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat list */}
          <ScrollArea className="flex-1 px-2 py-2">
            {!user ? (
              <div className="p-4 text-center text-sm">
                <p className="mb-3">Sign in to save your chat history</p>
                <Button onClick={onLogin} size="sm" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in
                </Button>
              </div>
            ) : loading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-lg shimmer" />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-1">
                {chats.filter((conv): conv is Chat => Boolean(conv && conv._id)).map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => {
                      if (!conv._id) return;
                      if (editingId === conv._id) return;
                      onSelectConversation(conv._id);
                    }}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
                      currentConversationId === conv._id
                        ? "bg-sidebar-accent"
                        : "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />

                    <div className="flex-1 truncate text-sm">
                      {editingId === conv._id ? (
                        <Input
                          ref={inputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 text-sm"
                        />
                      ) : (
                        conv.title || "New Chat"
                      )}
                    </div>

                    {editingId === conv._id ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveEdit}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex opacity-0 group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleStartEdit(e, conv)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleDelete(e, conv._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {user && (
            <div
              className="p-3 border-t border-sidebar-border cursor-pointer"
              onClick={onLogout}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {user.name?.[0] || "U"}
                </div>
                <div className="flex-1 truncate text-sm">
                  {user.name || user.email}
                </div>
                <LogOut className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed left-3 top-3 z-50"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
      )}
    </>
  );
};

export default ChatSidebar;
