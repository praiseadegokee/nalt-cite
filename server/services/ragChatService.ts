import { GoogleGenerativeAI } from '@google/generative-ai';
import { documentService } from './documentService';
import { dbStorage } from '../dbStorage';
import type { InsertChatConversation, InsertChatMessage } from '@shared/schema';

export class RAGChatService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.isConfigured = true;
      }
    } catch (error) {
      console.warn('RAG Chat Service: Gemini API not configured:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private checkConfiguration() {
    if (!this.isConfigured) {
      throw new Error('GEMINI_API_KEY environment variable is required for AI chat functionality');
    }
  }

  async createConversation(title: string) {
    const conversation = await dbStorage.createChatConversation({ title });
    return conversation;
  }

  async getConversations() {
    return await dbStorage.getChatConversations();
  }

  async getConversation(id: number) {
    return await dbStorage.getChatConversation(id);
  }

  async deleteConversation(id: number) {
    return await dbStorage.deleteChatConversation(id);
  }

  async getMessages(conversationId: number) {
    return await dbStorage.getChatMessages(conversationId);
  }

  async answerQuestion(conversationId: number, question: string) {
    this.checkConfiguration();
    
    try {
      // Search for relevant document chunks
      console.log('Searching for documents with query:', question);
      const relevantChunks = await documentService.searchDocuments(question);
      console.log('Found chunks:', relevantChunks.length);
      
      // Create context from retrieved documents
      let context = '';
      const sources: string[] = [];
      
      if (relevantChunks.length > 0) {
        console.log('Building context from', relevantChunks.length, 'chunks');
        context = 'Based on the following information from NALT guidelines and OSCOLA citation standards:\n\n';
        
        relevantChunks.forEach((chunk, index) => {
          context += `Source ${index + 1} (${chunk.documentTitle}):\n${chunk.content}\n\n`;
          if (!sources.includes(chunk.documentTitle)) {
            sources.push(chunk.documentTitle);
          }
        });
        
        console.log('Context being sent to AI:', context.substring(0, 500) + '...');
      } else {
        console.log('No relevant chunks found for query:', question);
      }

      // Create system prompt for legal citation assistance
      const systemPrompt = `You are a specialized assistant for legal citation and writing standards, specifically knowledgeable about Nigerian legal citation standards (NALT) and Oxford Standard for Citation of Legal Authorities (OSCOLA).

Your role is to:
1. Provide accurate guidance on legal citation formatting
2. Help with proper legal writing standards
3. Answer questions about NALT and OSCOLA requirements
4. Provide examples when helpful

When answering:
- Be precise and professional
- Cite specific sections or rules when possible
- Provide formatting examples when relevant
- Always use the provided context from the official guidelines when available
- Focus on practical application of citation rules

${context ? 'IMPORTANT: Use ONLY the provided context from the official NALT and OSCOLA guidelines to answer the question. Do not rely on general knowledge if specific information is provided in the context.' : 'No specific guideline documents are currently available.'}`;

      // Create the full prompt with context
      const fullPrompt = context ? 
        `${systemPrompt}

CONTEXT FROM OFFICIAL GUIDELINES:
${context}

User Question: ${question}

Please provide a comprehensive answer based on the official guidelines provided in the context above.` :
        `${systemPrompt}

User Question: ${question}

Please provide a comprehensive answer based on your general knowledge of legal citation standards.`;

      // Store user message
      await dbStorage.createChatMessage({
        conversationId,
        role: 'user',
        content: question,
        sources: null
      });

      // Generate response using Gemini
      const result = await this.model!.generateContent(fullPrompt);
      const response = result.response;
      const answer = response.text();

      // Store assistant message with sources
      const assistantMessage = await dbStorage.createChatMessage({
        conversationId,
        role: 'assistant',
        content: answer,
        sources: sources.length > 0 ? JSON.stringify(sources) : null
      });

      return {
        message: assistantMessage,
        sources: sources
      };

    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error('Failed to generate answer. Please try again.');
    }
  }

  async processUploadedDocument(filePath: string, filename: string) {
    try {
      // Determine document type based on filename
      let documentType: 'nalt' | 'oscola' = 'nalt';
      
      const filenameLower = filename.toLowerCase();
      if (filenameLower.includes('oscola')) {
        documentType = 'oscola';
      }

      // Process and store the PDF
      const documentId = await documentService.processAndStorePDF(filePath, filename, documentType);
      
      return {
        success: true,
        documentId,
        message: `Successfully processed ${filename} as ${documentType.toUpperCase()} document`
      };
    } catch (error) {
      console.error('Error processing document:', error);
      return {
        success: false,
        message: `Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getAvailableDocuments() {
    return await documentService.getAvailableDocuments();
  }

  async deleteDocument(id: number) {
    return await documentService.deleteDocument(id);
  }
}

export const ragChatService = new RAGChatService();