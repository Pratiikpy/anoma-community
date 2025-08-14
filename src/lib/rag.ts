import { GoogleGenerativeAI } from "@google/generative-ai";

const DEMO_KEY = "AIzaSyDepiRCs9vSA1T9MYHmtFRzhSvgborZKuc";
const API_KEY = process.env.GEMINI_API_KEY || DEMO_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

interface SearchResult {
  document: Document;
  score: number;
}

// Simple in-memory vector store (replace with Qdrant in production)
class SimpleVectorStore {
  private documents: Document[] = [];
  private embeddings: number[][] = [];

  async addDocuments(docs: Document[]) {
    for (const doc of docs) {
      const embedding = await this.getEmbedding(doc.content);
      this.documents.push(doc);
      this.embeddings.push(embedding);
    }
  }

  async search(query: string, topK: number = 4): Promise<SearchResult[]> {
    const queryEmbedding = await this.getEmbedding(query);
    
    const results: SearchResult[] = [];
    
    for (let i = 0; i < this.documents.length; i++) {
      const score = this.cosineSimilarity(queryEmbedding, this.embeddings[i]);
      results.push({
        document: this.documents[i],
        score
      });
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

const vectorStore = new SimpleVectorStore();

export async function initializeRAG(documents: Document[]) {
  await vectorStore.addDocuments(documents);
}

export async function enhancePromptWithRAG(question: string, docs: Document[]): Promise<string> {
  if (!process.env.WITH_RAG) {
    return question;
  }

  try {
    // Initialize with provided documents
    await vectorStore.addDocuments(docs);
    
    // Search for relevant documents
    const results = await vectorStore.search(question, 4);
    
    if (results.length === 0) {
      return question;
    }

    // Build context from top results
    const context = results
      .map(result => result.document.content)
      .join('\n\n');

    return `Context:\n${context}\n\nQuestion: ${question}\n\nPlease answer based on the provided context.`;
  } catch (error) {
    console.error("RAG error:", error);
    return question;
  }
} 