import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleResponses = [
  "I can help you with that! Could you provide more details about what you're working on?",
  "That's a great question! Here's a quick explanation:\n\nThe concept you're referring to involves breaking down the problem into smaller sub-problems and solving them recursively. This is known as **Divide and Conquer**.\n\n1. **Divide** the problem into smaller parts\n2. **Conquer** each sub-problem\n3. **Combine** the solutions",
  "Based on your question, here's a step-by-step solution:\n\n**Step 1:** Identify the base case\n**Step 2:** Define the recursive relation\n**Step 3:** Implement the solution\n\nWould you like me to elaborate on any step?",
  "That's a common problem in university courses. Let me break it down for you clearly. The key insight is to understand the relationship between the variables.",
];

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your **StudyHub AI Assistant**. I can help you with:\n\n- 📚 Academic questions\n- 🧮 Math problems\n- 💻 Programming help\n- 📝 Study tips & strategies\n- 🔬 Science concepts\n\nAsk me anything! (Connect your Google API key for full AI capabilities)",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated response (replace with Google AI API call)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] animate-slide-up">
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-accent" /> AI Assistant
        </h1>
        <p className="text-muted-foreground mt-1">Your personal academic problem solver.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-secondary" />
              </div>
            )}
            <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "gradient-primary text-primary-foreground"
                : "glass-card"
            }`}>
              {msg.content.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-1" : ""}>
                  {line.split("**").map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div className="glass-card rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card rounded-xl p-3 flex gap-3">
        <Input
          placeholder="Ask anything about your studies..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0"
        />
        <Button onClick={sendMessage} disabled={!input.trim() || isTyping} className="gradient-accent text-secondary">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AiChat;
