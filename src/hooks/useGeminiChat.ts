import { useState, useCallback } from "react";
import { GeminiService } from "@/lib/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const useGeminiChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));

    try {
      // Use Gemini API to generate response
      const response = await GeminiService.chat(userText);
      
      // Update the assistant message with the response
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: response }
            : msg
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Chat error:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to send message",
      }));
    }
  }, [state.messages]);

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  };
}; 