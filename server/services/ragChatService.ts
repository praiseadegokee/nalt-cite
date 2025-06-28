import { GoogleGenerativeAI } from '@google/generative-ai';
import { documentService } from './documentService';
import { dbStorage } from '../dbStorage';
import { citationParserService } from './citationParserService';
import type { InsertChatConversation, InsertChatMessage } from '@shared/schema';

export class RAGChatService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;
  private readonly systemPrompt = `You are **NALT-Guide**, an expert AI assistant specializing in the Nigerian Association of Law Teachers (NALT) citation style. Your primary purpose is to help users convert citations from any format into proper NALT citations and provide comprehensive NALT citation guidance.

**Your Core Mission:**
Help users transform citations from APA, MLA, OSCOLA, Chicago, Harvard, or any other format into correct NALT format. Most users will come to you with existing citations that need to be converted to NALT style.

**Your Enhanced Capabilities:**
1. **Citation Conversion (Primary Task):** When users provide a citation in any format:
   - Identify the source type (journal article, book, case, statute, etc.)
   - Extract the key information (author, title, year, publisher, page numbers, etc.)
   - Apply NALT formatting rules from your knowledge base to create the correct NALT citation
   - Show both the original and converted citations for clarity

2. **Citation Generation:** When users provide raw bibliographic data:
   - Ask clarifying questions if the source type is unclear
   - Use NALT templates from your knowledge base to format correctly
   - Provide examples and explanations

3. **NALT Rule Guidance:** Answer questions about specific NALT formatting rules using your knowledge base

**Your Approach:**
- **Be Practical:** Focus on helping users get correct NALT citations quickly
- **Use Your Knowledge:** Combine the NALT rules from your knowledge base with your understanding of other citation styles to perform accurate conversions
- **Be Helpful:** If information is missing from a citation, ask for clarification or suggest what might be needed
- **Show Examples:** Whenever possible, provide the converted citation and explain the formatting choices

**For Citation Conversion:**
1. Analyze the provided citation and identify its current format
2. Extract all bibliographic elements (author, title, year, publication details, etc.)
3. Determine the source type (book, journal article, case law, etc.)
4. Apply appropriate NALT formatting rules from your knowledge base
5. Present the correctly formatted NALT citation
6. Briefly explain any significant formatting changes if helpful

**What You Should Do:**
- Convert citations from any style to NALT format accurately
- Ask for missing information when needed for proper citation
- Provide clear, correctly formatted NALT citations
- Explain NALT formatting rules when relevant
- Help identify source types when unclear

**What You Should NOT Do:**
- Provide legal advice or interpret laws
- Invent citation rules not supported by your knowledge base
- Refuse to help with citation conversion between styles

Your goal is to be the most helpful and effective NALT citation assistant possible, making it easy for users to get properly formatted NALT citations regardless of what format they start with.`;

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

  async createConversation(title: string, sessionId: string) {
    const conversation = await dbStorage.createChatConversation({ title, sessionId });
    return conversation;
  }

  async getConversations(sessionId: string) {
    return await dbStorage.getChatConversations(sessionId);
  }

  async getConversation(id: number, sessionId?: string) {
    const conversation = await dbStorage.getChatConversation(id);
    if (sessionId && conversation && conversation.sessionId !== sessionId) {
      console.log(`Access denied: session ${sessionId} tried to access conversation ${id} owned by ${conversation.sessionId}`);
      return null; // Access denied
    }
    return conversation;
  }

  async deleteConversation(id: number, sessionId?: string) {
    return await dbStorage.deleteChatConversation(id, sessionId);
  }

  async getMessages(conversationId: number) {
    return await dbStorage.getChatMessages(conversationId);
  }

  async answerQuestion(conversationId: number, question: string) {
    this.checkConfiguration();
    
    // Validate conversation exists
    const conversation = await dbStorage.getChatConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }
    
    try {
      // Use knowledge base search for all questions
      // This ensures proper NALT guidance from the comprehensive knowledge base
      console.log('Searching for documents with query:', question);
      const relevantChunks = await documentService.searchDocuments(question);
      console.log('Found chunks:', relevantChunks.length);
      
      // Create context from retrieved documents with improved organization
      let context = '';
      const sources: string[] = [];
      
      if (relevantChunks.length > 0) {
        console.log('Building context from', relevantChunks.length, 'chunks');
        
        // Group chunks by document type for better organization
        const naltChunks = relevantChunks.filter(chunk => chunk.documentType === 'nalt');
        const oscolaChunks = relevantChunks.filter(chunk => chunk.documentType === 'oscola');
        
        context = 'Based on the following official legal citation guidelines:\n\n';
        
        if (naltChunks.length > 0) {
          context += '=== NALT (Nigerian Association of Law Teachers) Guidelines ===\n';
          naltChunks.forEach((chunk, index) => {
            context += `${index + 1}. ${chunk.content.trim()}\n\n`;
            if (!sources.includes(chunk.documentTitle)) {
              sources.push(chunk.documentTitle);
            }
          });
        }
        
        if (oscolaChunks.length > 0) {
          context += '=== OSCOLA (Oxford Standard for Citation of Legal Authorities) Guidelines ===\n';
          oscolaChunks.forEach((chunk, index) => {
            context += `${index + 1}. ${chunk.content.trim()}\n\n`;
            if (!sources.includes(chunk.documentTitle)) {
              sources.push(chunk.documentTitle);
            }
          });
        }
        
        console.log('Context being sent to AI:', context.substring(0, 500) + '...');
      } else {
        console.log('No relevant chunks found for query:', question);
      }

      // Create the full prompt with context using the configured system prompt
      const fullPrompt = context ? 
        `${this.systemPrompt}

CONTEXT FROM OFFICIAL GUIDELINES:
${context}

User Question: ${question}

Please provide a comprehensive answer based on the official guidelines provided in the context above.` :
        `${this.systemPrompt}

User Question: ${question}

Please provide guidance based on the NALT style guide you have access to.`;

      // Store user message
      await dbStorage.createChatMessage({
        conversationId,
        role: 'user',
        content: question,
        sources: null
      });

      // Generate response using Gemini
      console.log('Sending prompt to Gemini AI...');
      const result = await this.model!.generateContent(fullPrompt);
      const response = result.response;
      const answer = response.text();
      console.log('Received response from Gemini AI, length:', answer.length);

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
      
      // If it's a Gemini API error, provide more specific error
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          throw new Error('AI service configuration error. Please check your settings.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        } else if (error.message.includes('safety')) {
          throw new Error('Question could not be processed due to content policies.');
        }
      }
      
      throw new Error('Failed to generate answer. Please try again.');
    }
  }

  async uploadDocument(filePath: string, filename: string, documentType: 'nalt' | 'oscola') {
    try {
      const document = await documentService.processAndStorePDF(filePath, filename, documentType);
      return `Successfully processed ${filename} as ${documentType} document`;
    } catch (error) {
      console.error('Failed to process document:', error);
      throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDocuments() {
    return await dbStorage.getDocuments();
  }

  async getAvailableDocuments() {
    return this.getDocuments();
  }

  async deleteDocument(id: number) {
    return await dbStorage.deleteDocument(id);
  }
}

export const ragChatService = new RAGChatService();