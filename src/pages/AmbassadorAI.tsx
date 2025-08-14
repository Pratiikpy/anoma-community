import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, FileText, Video, Image, Calendar, Lightbulb } from "lucide-react";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { useChatStats } from "@/hooks/useChatStats";

// Message interface for chat
interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  category?: "program" | "content" | "recommendation" | "event";
}

// Pre-loaded Xion knowledge base
const XION_KNOWLEDGE = {
  programs: ["Xion Account Abstraction - Simplifies blockchain interactions by removing gas fees and complex wallet management", "Developer Grant Program - Funding for developers building on Xion ecosystem", "Community Ambassador Program - Leadership opportunities for active community members", "Content Creator Incentives - Rewards for high-quality educational and promotional content"],
  contentTypes: ["Technical Tutorials - Step-by-step guides for developers", "Educational Threads - Twitter/X threads explaining Xion concepts", "Demo Videos - Screen recordings showing Xion integrations", "Infographics - Visual explanations of complex blockchain concepts", "Case Studies - Real-world applications and success stories", "Community Memes - Fun content that builds engagement"],
  events: ["Weekly Developer Office Hours - Wednesdays 2PM UTC", "Monthly Community AMA - First Friday of each month", "Quarterly Hackathons - Build and win prizes on Xion", "Annual XionCon - Virtual conference with industry leaders"],
  recommendations: ["Create beginner-friendly content explaining account abstraction", "Develop integration tutorials for popular frameworks", "Share your building journey and lessons learned", "Collaborate with other community members on projects", "Participate in community discussions and provide feedback"]
};
export default function AmbassadorAI() {
  const { messages: geminiMessages, isLoading, error, sendMessage, clearMessages } = useGeminiChat();
  const { stats, loading: statsLoading, refetch: refetchStats } = useChatStats();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert Gemini messages to our format
  const messages: Message[] = geminiMessages.length === 0 ? [{
    id: "1",
    type: "ai",
    content: "Hello! I'm ASJ AI, your Anoma Community AI assistant. I can help you learn about Anoma Network, blockchain technology, community topics, and much more. I'm powered by Google's Gemini AI to provide you with the most accurate and helpful information. What would you like to know?",
    timestamp: new Date(),
    category: "program"
  }] : geminiMessages.map(msg => ({
    id: msg.id,
    type: msg.role === "user" ? "user" : "ai",
    content: msg.content,
    timestamp: msg.timestamp,
    category: msg.role === "assistant" ? "program" : undefined
  }));

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    await sendMessage(inputMessage);
    setInputMessage("");
    
    // Refresh stats after sending a message
    setTimeout(() => {
      refetchStats();
    }, 1000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const getCategoryIcon = (category?: Message["category"]) => {
    switch (category) {
      case "program":
        return <Sparkles className="w-4 h-4" />;
      case "content":
        return <FileText className="w-4 h-4" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };
  const quickActions = [{
    text: "What is Anoma Network?",
    icon: <Sparkles className="w-4 h-4" />
  }, {
    text: "Explain intent-centric architecture",
    icon: <FileText className="w-4 h-4" />
  }, {
    text: "Tell me about fractal scaling",
    icon: <Calendar className="w-4 h-4" />
  }, {
    text: "What is the MASP?",
    icon: <Lightbulb className="w-4 h-4" />
  }];
  return <div className="min-h-screen bg-anoma-black text-anoma-white relative overflow-hidden bg-anoma-grid">
      {/* Anoma Gem Background */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <img 
          src="/anoma-gem.png" 
          alt="Anoma Gem" 
          className="w-96 h-96 object-contain"
        />
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-glow animate-glow-pulse pointer-events-none opacity-30" />
      
      <div className="relative z-10 pt-20 pb-8 px-[54px] py-[9px]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6 py-[18px]">
                               <img 
                   src="/anoma-logo-new.jpg" 
                   alt="ASJ AI Avatar" 
                   className="w-16 h-16 object-cover rounded-none border-2 border-anoma-gray"
                 />
                                     <h1 className="text-6xl font-mono font-bold text-anoma-white uppercase tracking-wider">
                         ASJ AI
              </h1>
            </div>
            <p className="text-xl text-anoma-white/80 max-w-4xl mx-auto font-sans">
              Your intelligent guide to Xion programs, content creation opportunities, and community events
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
                <CardHeader className="border-b border-anoma-gray">
                  <CardTitle className="flex items-center gap-3 font-mono text-anoma-white uppercase tracking-wide">
                    <Bot className="w-6 h-6 text-anoma-red" />
                    CHAT WITH AMBASSADOR AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                          {message.type === "ai" && <div className="w-8 h-8 bg-anoma-red rounded-none flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-anoma-white" />
                            </div>}
                          <div className={`max-w-[80%] rounded-none px-4 py-3 ${message.type === "user" ? "bg-anoma-red text-anoma-white" : "bg-anoma-gray text-anoma-white"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              {message.type === "ai" && message.category && <Badge variant="secondary" className="text-xs rounded-none font-mono uppercase">
                                  {getCategoryIcon(message.category)}
                                  {message.category}
                                </Badge>}
                            </div>
                            <p className="whitespace-pre-line font-sans">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1 font-sans">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.type === "user" && <div className="w-8 h-8 bg-anoma-gray rounded-none flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-anoma-white" />
                            </div>}
                        </div>)}
                      
                      {/* Typing indicator */}
                      {isLoading && <div className="flex gap-3">
                          <div className="w-8 h-8 bg-anoma-red rounded-none flex items-center justify-center">
                            <Bot className="w-4 h-4 text-anoma-white" />
                          </div>
                          <div className="bg-anoma-gray rounded-none px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-anoma-red rounded-none animate-bounce"></div>
                              <div className="w-2 h-2 bg-anoma-red rounded-none animate-bounce" style={{
                            animationDelay: '0.1s'
                          }}></div>
                              <div className="w-2 h-2 bg-anoma-red rounded-none animate-bounce" style={{
                            animationDelay: '0.2s'
                          }}></div>
                            </div>
                          </div>
                        </div>}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-6 border-t border-anoma-gray">
                    <div className="flex gap-3">
                      <Input 
                        value={inputMessage} 
                        onChange={e => setInputMessage(e.target.value)} 
                        onKeyPress={handleKeyPress} 
                        placeholder="Ask me about Xion programs, content ideas, or upcoming events..." 
                        disabled={isLoading} 
                        className="flex-1 bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white placeholder:text-anoma-white/40" 
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim() || isLoading} 
                        size="icon" 
                        className="btn-anoma-primary"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Info */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="bg-anoma-black backdrop-blur-sm border-anoma-gray rounded-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-mono text-anoma-white uppercase tracking-wide">QUICK QUESTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {quickActions.map((action, index) => <Button key={index} className="w-full justify-start text-left h-auto py-4 px-4 whitespace-normal btn-anoma-secondary" onClick={() => setInputMessage(action.text)}>
                      <span className="mr-3 flex-shrink-0">{action.icon}</span>
                      <span className="text-sm leading-relaxed font-sans">{action.text}</span>
                    </Button>)}
                </CardContent>
              </Card>

              {/* Ambassador Stats */}
              <Card className="bg-gradient-card backdrop-blur-sm border-border">
                <CardHeader className="py-[20px]">
                  <CardTitle className="text-lg">Ambassador Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? "..." : `${stats.total_chats}+`}
                    </div>
                    <div className="text-sm text-muted-foreground">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {statsLoading ? "..." : `${stats.total_content_ideas}+`}
                    </div>
                    <div className="text-sm text-muted-foreground">Content Ideas Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Always Available</div>
                  </div>
                  {stats.last_updated && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(stats.last_updated).toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Knowledge Areas */}
              
            </div>
          </div>
        </div>
      </div>
    </div>;
}