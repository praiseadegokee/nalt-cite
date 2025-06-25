import { GoogleGenerativeAI } from '@google/generative-ai';
import { documentService } from './documentService';
import { dbStorage } from '../dbStorage';
import { citationParserService } from './citationParserService';
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
      // Check if this is a citation request
      const isCitationRequest = await citationParserService.detectCitationIntent(question);
      console.log('Citation intent detected:', isCitationRequest);

      if (isCitationRequest) {
        // Try to parse and format the citation
        try {
          const citationResult = await citationParserService.parseAndFormatCitation(question);
          
          // Store user message
          await dbStorage.createChatMessage({
            conversationId,
            role: 'user',
            content: question,
            sources: null
          });

          // Create formatted response with better formatting
          let formattedResponse = `**NALT Citation Generated:**

\`${citationResult.citation}\`

**Source Type:** ${citationResult.type.charAt(0).toUpperCase() + citationResult.type.slice(1)}

**Confidence:** ${citationResult.details.confidence > 0.8 ? 'High - Citation appears complete' : 'Medium - Please verify details'}

Need help with a different citation or want to modify this one? Just provide the source details!`;

          // Store assistant message
          const assistantMessage = await dbStorage.createChatMessage({
            conversationId,
            role: 'assistant',
            content: formattedResponse,
            sources: JSON.stringify(['NALT Citation Assistant'])
          });

          return {
            message: assistantMessage,
            sources: ['NALT Citation Assistant']
          };
        } catch (citationError) {
          console.log('Citation parsing failed, falling back to template guidance:', citationError);
          
          // Provide template guidance if parsing fails
          const templateResponse = `I'd be happy to help you create a proper NALT citation! 

${citationParserService.generateCitationTemplate('case')}

Please provide the details for your source, and I'll format it correctly according to NALT citation standards.`;

          // Store user message
          await dbStorage.createChatMessage({
            conversationId,
            role: 'user',
            content: question,
            sources: null
          });

          // Store assistant message
          const assistantMessage = await dbStorage.createChatMessage({
            conversationId,
            role: 'assistant',
            content: templateResponse,
            sources: JSON.stringify(['NALT Citation Assistant'])
          });

          return {
            message: assistantMessage,
            sources: ['NALT Citation Assistant']
          };
        }
      }

      // Regular RAG search for non-citation questions
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