import { useState, useEffect } from 'react';

export interface ApprovedContent {
  id: string;
  title: string;
  category: "threads" | "videos" | "graphics";
  author: string;
  url?: string; // Social media link
  thumbnail_url?: string;
  file_url?: string; // Database might use file_url instead of thumbnail_url
  created_at: string;
}

export function useApprovedContent() {
  const [content, setContent] = useState<ApprovedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovedContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/content/approved');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        setError('Failed to fetch approved content');
      }
    } catch (err) {
      setError('Failed to fetch approved content');
      console.error('Error fetching approved content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedContent();
  }, []);

  const refetch = () => {
    fetchApprovedContent();
  };

  return {
    content,
    loading,
    error,
    refetch
  };
} 