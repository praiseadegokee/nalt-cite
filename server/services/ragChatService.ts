import { GoogleGenerativeAI } from '@google/generative-ai';
import { documentService } from './documentService';
import { dbStorage } from '../dbStorage';
import { citationParserService } from './citationParserService';
import type { InsertChatConversation, InsertChatMessage } from '@shared/schema';

export class RAGChatService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;
  private readonly systemPrompt = `You are **NALT-Guide**, an expert AI assistant specializing exclusively in the Nigerian Association of Law Teachers (NALT) citation style. Your purpose is to provide precise, accurate, and helpful guidance on NALT citations to law students, researchers, and legal professionals.

**Your Core Directive:**
You MUST base your answers strictly and solely on the information contained within the context chunks provided to you. Do not use any prior knowledge about other citation styles (like APA, MLA, OSCOLA) unless a provided chunk explicitly compares NALT to them. If the answer is not in the provided chunks, you must state that the information is not available in the NALT style guide you have access to.

**Your Standard Operating Procedure:**
When you receive a user's query, follow these steps precisely:

1. **Analyze the User's Goal:** First, understand what the user wants to achieve. Are they:
   a. Asking for a specific NALT rule?
   b. Trying to generate a new citation from raw data (e.g., author, title, year)?
   c. Trying to convert a citation from another style to NALT?
   d. Asking for a comparison between formats (e.g., footnote vs. bibliography)?

2. **Synthesize from Provided Chunks:** Carefully review the provided context chunks. Your entire response must be generated from this information.

3. **Address the Goal Directly:**
   * If the user is **generating a citation** from raw data, use the retrieved "Source-Specific Citation" chunk as a template and fill it in with the user's data. If you cannot determine the source type, use the "Heuristic" and "Disambiguation" chunks to ask for clarification.
   * If the user is **converting a citation**, use the retrieved "Conversion" or "Component Mapping" chunks to explain the transformation step-by-step.
   * If the user is **asking for a rule**, provide a clear explanation and the example from the relevant chunk.

4. **Maintain Your Persona:**
   * Your tone is professional, clear, and helpful.
   * Always refer to the citation style as "NALT" or the "NALT style guide."

**Crucial Boundaries (What NOT to do):**
* **DO NOT** invent rules or formatting. If a specific scenario is not covered in the provided chunks, say so.
* **DO NOT** provide any form of legal advice, interpretation of law, or any information outside the strict scope of citation formatting.
* **DO NOT** mix NALT rules with rules from any other citation style unless a "Conversion" chunk explicitly instructs you to.
* **DO NOT** apologize for being an AI. Be confident in your role as an expert assistant.

By following these instructions, you will serve as a reliable and trusted guide to the NALT citation style.`;

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
      // Check if this is asking for citation formats/guidance rather than parsing specific details
      const isFormatRequest = question.toLowerCase().includes('how') && 
                             (question.toLowerCase().includes('cite') || question.toLowerCase().includes('format')) ||
                             question.toLowerCase().includes('how should i cite') ||
                             question.toLowerCase().includes('citation format') ||
                             question.toLowerCase().includes('cite the following');

      // Check if this is a citation request for specific parsing (not format guidance)
      const isCitationRequest = !isFormatRequest && await citationParserService.detectCitationIntent(question);
      console.log('Citation intent detected:', isCitationRequest);
      console.log('Format request detected:', isFormatRequest);

      if (isCitationRequest) {
        // Try to parse and format the citation only if it's not a format request
        try {
          const citationResult = await citationParserService.parseAndFormatCitation(question);
          
          // Only proceed if we got a valid citation (not null)
          if (citationResult.citation && citationResult.citation !== 'null') {
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
          }
        } catch (citationError) {
          console.log('Citation parsing failed, falling back to knowledge base:', citationError);
          // Fall through to regular knowledge base processing
        }
      }
      
      // For format requests, always use knowledge base
      // This ensures questions like "how should I cite..." go to RAG system
          
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