const GEMINI_API_KEY = 'AIzaSyBtdxAevjwr66TCGMzIk8Jn8l5NbAiLRf0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  static async chat(message: string, context?: string): Promise<string> {
    const prompt = context 
      ? `Context: You are ASJ AI, an AI assistant for the Anoma Community. You help users understand Anoma Network, blockchain technology, and community topics. Be helpful, knowledgeable, and maintain the Anoma aesthetic in your responses.

User message: ${message}

Please respond as ASJ AI, being helpful and informative while maintaining a professional yet friendly tone.`
      : `You are ASJ AI, an AI assistant for the Anoma Community. You help users understand Anoma Network, blockchain technology, and community topics. Be helpful, knowledgeable, and maintain the Anoma aesthetic in your responses.

User message: ${message}

Please respond as ASJ AI, being helpful and informative while maintaining a professional yet friendly tone.`;

    return this.makeRequest(prompt);
  }

  static async getAnomaInfo(query: string): Promise<string> {
    const prompt = `You are ASJ AI, an expert on Anoma Network. Provide detailed, accurate information about Anoma based on this query: "${query}".

Focus on:
- Anoma's intent-centric architecture
- Technical innovations (fractal scaling, MASP, ARM)
- Team and funding information
- Development roadmap
- Use cases and benefits

Be comprehensive but accessible. Use the Anoma aesthetic in your response.`;

    return this.makeRequest(prompt);
  }
} 