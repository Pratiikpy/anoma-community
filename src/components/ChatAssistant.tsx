import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

// Interface for chat messages
interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Xion Ambassador Program knowledge
const xionKnowledge = `
Xion Ambassador Program Overview:
The Xion Ambassador Program is designed to empower community leaders and content creators to spread awareness about Xion's innovative blockchain technology.

Program Benefits:
- Early access to new features and updates
- Direct communication with the Xion team
- Exclusive ambassador NFTs and rewards
- Opportunities to collaborate on official content
- Monthly ambassador meetups and events
- Access to ambassador-only Discord channels

Content Creation Support:
- Templates and guidelines for creating Xion content
- Technical resources and documentation
- Graphics assets and brand materials
- Support for video production and editing
- Help with thread writing and social media posts

Ambassador Responsibilities:
- Create educational content about Xion's features
- Engage with community members and answer questions
- Share Xion updates and announcements
- Participate in community events and AMAs
- Provide feedback on new features and improvements

Popular Content Types:
- Educational threads about account abstraction
- Video tutorials on using Xion dApps
- Infographics explaining gasless transactions
- Community event recaps and highlights
- Developer guides and technical documentation

Upcoming Events:
- Monthly Ambassador Meetup (Last Friday of each month)
- Xion DevCon 2024 (Q2 2024)
- Community Content Contest (Ongoing)
- Ambassador Spotlight Series (Weekly)
`;
export default function ChatAssistant() {
  // State for managing chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "welcome",
    content: "Hi! I'm your Xion Ambassador AI assistant. Ask me anything about the Ambassador Program, content creation, upcoming events, or how to get involved!",
    role: "assistant",
    timestamp: new Date()
  }]);

  // State for the current message being typed
  const [currentMessage, setCurrentMessage] = useState("");

  // State to track if AI is "thinking" (generating response)
  const [isLoading, setIsLoading] = useState(false);

  // State to control if chat is expanded or minimized
  const [isExpanded, setIsExpanded] = useState(false);

  // Ref to scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Function to simulate AI response (in real app, this calls your AI API)
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple keyword-based responses (in real app, use OpenAI/Claude API)
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("ambassador") || lowerMessage.includes("program")) {
      return "The Xion Ambassador Program empowers community leaders to create content and spread awareness! Benefits include early access to features, exclusive NFTs, monthly meetups, and direct team communication. Ready to apply?";
    }
    if (lowerMessage.includes("content") || lowerMessage.includes("create")) {
      return "Popular content types include educational threads about account abstraction, video tutorials, infographics about gasless transactions, and developer guides. We provide templates, graphics assets, and technical resources to help you create amazing content!";
    }
    if (lowerMessage.includes("event") || lowerMessage.includes("meetup")) {
      return "Upcoming events include: Monthly Ambassador Meetups (last Friday), Xion DevCon 2024 (Q2), ongoing Community Content Contest, and weekly Ambassador Spotlight Series. Join our Discord for the latest updates!";
    }
    if (lowerMessage.includes("getting started") || lowerMessage.includes("how to")) {
      return "To become a Xion Ambassador: 1) Join our Discord community, 2) Start creating Xion-related content, 3) Engage with the community, 4) Apply through our ambassador portal. We're looking for passionate creators and community builders!";
    }
    if (lowerMessage.includes("account abstraction") || lowerMessage.includes("gasless")) {
      return "Great topic for ambassador content! Account abstraction means users don't manage private keys, and gasless transactions remove token requirements. These are perfect subjects for educational threads and videos!";
    }

    // Default response
    return `Thanks for your question about "${userMessage}". As your Ambassador AI, I can help with program details, content creation tips, upcoming events, and community opportunities. What would you like to explore?`;
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      role: "user",
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    try {
      // Generate AI response
      const aiResponseContent = await generateAIResponse(currentMessage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        role: "assistant",
        timestamp: new Date()
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Handle error case
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again later!",
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <>
      {/* Chat toggle button - fixed position in bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 rounded-none bg-anoma-red hover:opacity-90 shadow-lg"
          size="icon"
        >
          <svg className="w-7 h-7 text-anoma-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </Button>
      </div>

      {/* Chat window - slides up from bottom */}
      {isExpanded && <div className="fixed bottom-20 right-6 w-96 h-[500px] z-50">
          <Card className="h-full border-anoma-gray bg-anoma-black backdrop-blur-sm shadow-glow rounded-none">
            {/* Chat header */}
            <div className="flex justify-between items-center p-4 border-b border-anoma-gray bg-anoma-red">
              <div className="flex items-center gap-3">
                <img 
                  src="/anoma-logo.jpg" 
                  alt="Anoma Logo" 
                  className="w-8 h-8 object-cover rounded-none border border-anoma-white"
                />
                <div>
                  <h3 className="font-mono font-semibold text-anoma-white uppercase tracking-wide">AMBASSADOR AI</h3>
                  <p className="text-xs text-anoma-white/80 font-sans">Your Xion Ambassador guide</p>
                </div>
              </div>
              <Button size="sm" className="text-anoma-white hover:bg-anoma-white/20 rounded-none" onClick={() => setIsExpanded(false)}>
                ✕
              </Button>
            </div>

            {/* Messages area */}
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-none ${message.role === "user" ? "bg-anoma-red text-anoma-white" : "bg-anoma-gray text-anoma-white"}`}>
                      <p className="text-sm font-sans">{message.content}</p>
                      <span className="text-xs opacity-70 font-sans">
                        {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                      </span>
                    </div>
                  </div>)}
                
                {/* Loading indicator */}
                {isLoading && <div className="flex justify-start">
                    <div className="bg-anoma-gray text-anoma-white p-3 rounded-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-anoma-red rounded-none animate-pulse"></div>
                        <div className="w-2 h-2 bg-anoma-red rounded-none animate-pulse" style={{
                    animationDelay: "0.2s"
                  }}></div>
                        <div className="w-2 h-2 bg-anoma-red rounded-none animate-pulse" style={{
                    animationDelay: "0.4s"
                  }}></div>
                      </div>
                    </div>
                  </div>}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-4 py-3 border-t border-anoma-gray">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" className="text-xs h-7 px-3 btn-anoma-secondary rounded-none" onClick={() => setCurrentMessage("What is account abstraction?")}>
                    ACCOUNT ABSTRACTION
                  </Button>
                  <Button size="sm" className="text-xs h-7 px-3 btn-anoma-secondary rounded-none" onClick={() => setCurrentMessage("How does gasless work?")}>
                    GASLESS TRANSACTIONS
                  </Button>
                  <Button size="sm" className="text-xs h-7 px-3 btn-anoma-secondary rounded-none" onClick={() => setCurrentMessage("Getting started guide")}>
                    GETTING STARTED
                  </Button>
                </div>
                
                {/* Input area */}
                <div className="flex gap-3">
                  <Input 
                    value={currentMessage} 
                    onChange={e => setCurrentMessage(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    placeholder="Ask about Xion Ambassador program..." 
                    className="flex-1 bg-anoma-black/50 border-anoma-gray focus:border-anoma-red rounded-none text-anoma-white placeholder:text-anoma-white/40" 
                    disabled={isLoading} 
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!currentMessage.trim() || isLoading} 
                    size="sm" 
                    className="btn-anoma-primary"
                  >
                    SEND
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>}
    </>;
}