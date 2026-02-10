import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  content: React.ReactNode;
  isUser: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

const MessageBubble = ({ content, isUser, timestamp, status = "read" }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-3",
        isUser ? "justify-end animate-slide-in-right" : "justify-start animate-fade-in"
      )}
    >
      <div
        className={cn(
          "relative",
          isUser
            ? "max-w-[85%] md:max-w-[70%] px-4 py-3 bg-chat-user text-primary-foreground rounded-bubble rounded-br-md"
            : "max-w-[90%] md:max-w-[75%] px-5 py-4"
        )}
      >
        {isUser ? (
          <div className="text-sm leading-relaxed">{content}</div>
        ) : (
          <div className="ai-markdown text-[15px] leading-[1.7] text-foreground">
            {typeof content === "string" ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1.5 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1.5">{children}</ol>,
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 border-primary/40 pl-4 my-3 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return (
                        <pre className="bg-muted rounded-lg p-4 my-3 overflow-x-auto text-sm">
                          <code className="text-foreground">{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-[13px] font-mono">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <>{children}</>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div>{content}</div>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1",
            isUser ? "text-primary-foreground/60" : "text-muted-foreground"
          )}
        >
          <span className="text-[10px]">{timestamp}</span>
          {isUser && (
            status === "read" ? (
              <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;