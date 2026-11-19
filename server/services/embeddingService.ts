import { GoogleGenerativeAI } from '@google/generative-ai';

export class EmbeddingService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.isConfigured && this.model) return;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
        this.isConfigured = true;
      }
    } catch (error) {
      console.warn('Embedding Service: Gemini API not configured:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    this.ensureInitialized();
    if (!this.isConfigured) {
      throw new Error('Embedding service not configured');
    }

    try {
      const result = await this.model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate text embedding');
    }
  }

  // Calculate cosine similarity between two embeddings
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }
}

export const embeddingService = new EmbeddingService();