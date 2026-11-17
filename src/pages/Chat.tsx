import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Loader2, LogIn } from "lucide-react";
import { chatAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How can I manage my anxiety?",
  "Tips for better sleep",
  "How to deal with work stress?",
  "Mindfulness techniques for beginners",
];

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! 👋 I'm your MindWell AI wellness assistant. I'm here to support your mental health journey.\n\nI can help with:\n• Anxiety & stress management\n• Sleep improvement tips\n• Mindfulness techniques\n• General wellness guidance\n\nHow are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadHistory = async () => {
      try {
        const res = await chatAPI.getHistory();
        if (res.data && res.data.length > 0) {
          const history: Message[] = res.data.map((msg: any) => ({
            id: msg._id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
          }));
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: "Welcome back! 👋 Here's your chat history. Feel free to continue our conversation.",
              timestamp: new Date(history[0]?.timestamp.getTime() - 1000),
            },
            ...history,
          ]);
        }
      } catch {
        // Silently fail — keep the welcome message
      }
    };
    loadHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    if (isAuthenticated) {
      try {
        const res = await chatAPI.send(content.trim());
        const aiMessage: Message = {
          id: res.data.aiMessage._id,
          role: "assistant",
          content: res.data.aiMessage.content,
          timestamp: new Date(res.data.aiMessage.createdAt),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error: any) {
        toast.error("Failed to get response");
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } else {
      // Offline fallback for non-logged-in users
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: "Thank you for sharing. To save your chat history and get personalized support, please **sign up** or **log in**.\n\nI can still chat with you, but your conversation won't be saved.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 800);
    }

    setIsTyping(false);
  };

  return (
    <div className="container py-6 max-w-4xl">
      {!isAuthenticated && (
        <div className="mb-4 p-3 rounded-lg bg-muted border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sign in to save your chat history and get personalized support.
          </p>
          <Link to="/login">
            <Button size="sm" variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          </Link>
        </div>
      )}

      <Card className="h-[calc(100vh-14rem)]">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">MindWell AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Always here to support you</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={message.role === "assistant" ? "bg-primary/10" : "bg-secondary"}>
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }} />
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-3">
              <p className="text-xs text-muted-foreground mb-2">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
