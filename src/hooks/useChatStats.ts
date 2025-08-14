import { useState, useEffect } from "react";

interface ChatStats {
  total_chats: number;
  total_content_ideas: number;
  last_updated: string;
}

export const useChatStats = () => {
  const [stats, setStats] = useState<ChatStats>({
    total_chats: 0,
    total_content_ideas: 0,
    last_updated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat-stats"); // Updated to relative URL
      
      if (!response.ok) {
        throw new Error("Failed to fetch chat statistics");
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching chat stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}; 