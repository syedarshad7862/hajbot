import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Ban } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isBlocked?: boolean;
  blockMessage?: string | null;
}

const ChatInput = ({ onSend, disabled, isBlocked, blockMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep focus on textarea after sending
  useEffect(() => {
    if (!disabled && !isBlocked && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled, isBlocked]);

  const handleSend = () => {
    if (message.trim() && !disabled && !isBlocked) {
      onSend(message.trim());
      setMessage("");
      // Refocus the textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isBlocked) {
    return (
      <div className="bg-destructive/10 border-t border-destructive/20 px-4 py-4 safe-area-pb">
        <div className="flex items-center justify-center gap-2 text-destructive">
          <Ban className="w-5 h-5" />
          <span className="font-medium">{blockMessage || 'Chat access disabled by admin'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-t border-border px-4 py-3 safe-area-pb">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-32 scrollbar-hide"
            style={{ minHeight: "48px" }}
          />
        </div>

        {message.trim() ? (
          <Button
            variant="send"
            size="icon"
            onClick={handleSend}
            disabled={disabled}
            className="flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary flex-shrink-0"
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
