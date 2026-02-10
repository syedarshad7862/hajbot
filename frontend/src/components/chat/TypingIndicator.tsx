const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="bg-chat-ai border border-border rounded-bubble rounded-bl-md px-4 py-3 shadow-bubble">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
          <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
