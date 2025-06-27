import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { dbStorage } from '../dbStorage';
import type { InsertDocument, InsertDocumentChunk } from '@shared/schema';

export class DocumentService {
  
  async processAndStorePDF(filePath: string, filename: string, documentType: 'nalt' | 'oscola'): Promise<number> {
    try {
      let text: string;
      
      // Handle different file types
      if (filename.toLowerCase().endsWith('.pdf')) {
        // Read the PDF file
        const pdfBuffer = fs.readFileSync(filePath);
        
        // Extract text from PDF
        const pdfData = await pdf(pdfBuffer);
        text = pdfData.text;
      } else if (filename.toLowerCase().endsWith('.txt')) {
        // Read text file
        text = fs.readFileSync(filePath, 'utf-8');
      } else {
        throw new Error('Unsupported file type. Only PDF and TXT files are supported.');
      }
      
      // Validate extracted text
      if (!text || text.trim().length < 100) {
        throw new Error('Document appears to be empty or too short. Please ensure the document contains readable text.');
      }
      
      // Create document title based on filename
      const title = filename.replace(/\.(pdf|txt|doc|docx)$/i, '').replace(/[-_]/g, ' ');
      
      // Check if document with same filename already exists
      const existingDocuments = await dbStorage.getDocuments();
      const existing = existingDocuments.find(doc => doc.filename === filename);
      
      if (existing) {
        // Delete existing document and its chunks
        await dbStorage.deleteDocument(existing.id);
        console.log(`Replaced existing document: ${filename}`);
      }
      
      // Store the document
      const document = await dbStorage.createDocument({
        filename,
        title,
        content: text,
        documentType
      });
      
      console.log(`Created document: ${title} (${text.length} characters)`);
      
      // Process and store chunks
      await this.chunkAndStoreDocument(document.id, text);
      
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.warn('Failed to clean up uploaded file:', cleanupError);
      }
      
      return document.id;
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async chunkAndStoreDocument(documentId: number, content: string): Promise<void> {
    // Improved chunking strategy - split by paragraphs first, then by size
    const chunkSize = 800; // Reduced for better semantic coherence
    const overlap = 150;
    
    const chunks: string[] = [];
    let startIndex = 0;
    
    while (startIndex < content.length) {
      const endIndex = Math.min(startIndex + chunkSize, content.length);
      let chunk = content.slice(startIndex, endIndex);
      
      // Improved splitting logic - look for paragraph breaks first, then sentences
      let splitIndex = endIndex;
      if (endIndex < content.length) {
        // First, look for paragraph breaks (double newline)
        const lookbackRange = Math.min(200, chunk.length);
        const lookbackText = chunk.slice(-lookbackRange);
        
        let paragraphEnd = lookbackText.lastIndexOf('\n\n');
        if (paragraphEnd === -1) {
          // If no paragraph break, look for sentence endings
          paragraphEnd = lookbackText.lastIndexOf('. ');
          if (paragraphEnd === -1) {
            paragraphEnd = lookbackText.lastIndexOf('.');
          }
        }
        
        if (paragraphEnd !== -1) {
          splitIndex = startIndex + chunk.length - lookbackRange + paragraphEnd + 1;
          chunk = content.slice(startIndex, splitIndex);
        }
      }
      
      // Only add non-empty chunks
      if (chunk.trim().length > 50) { // Minimum chunk size
        chunks.push(chunk.trim());
      }
      
      // Move to next chunk with overlap
      startIndex = Math.max(splitIndex - overlap, startIndex + 1);
      if (startIndex >= splitIndex) break; // Prevent infinite loop
    }
    
    console.log(`Created ${chunks.length} chunks for document ${documentId}`);
    
    // Store chunks in database
    for (let i = 0; i < chunks.length; i++) {
      const chunkData: InsertDocumentChunk = {
        documentId,
        chunkIndex: i,
        content: chunks[i]
      };
      
      await dbStorage.createDocumentChunk(chunkData);
    }
  }
  
  async searchDocuments(query: string): Promise<any[]> {
    console.log('DocumentService: Searching for query:', query);
    
    // Extract meaningful keywords from the query
    const keywords = this.extractKeywords(query);
    console.log('Extracted keywords:', keywords);
    
    // Search in document chunks using keywords (basic approach)
    const chunks = await dbStorage.searchDocumentChunks(query);
    console.log('DocumentService: Found chunks from DB:', chunks.length);
    
    // Process chunks to include document information and improve ranking
    const results = [];
    console.log(`Processing ${chunks.length} chunks for scoring...`);
    
    for (const chunk of chunks) {
      const document = await dbStorage.getDocument(chunk.documentId);
      if (document) {
        console.log(`Processing chunk ${chunk.id} with content preview: "${chunk.content.substring(0, 100)}..."`);
        
        // Calculate relevance score based on keyword matches
        const relevanceScore = this.calculateRelevanceScore(chunk.content, keywords, query);
        
        console.log(`Chunk ${chunk.id} scored: ${relevanceScore}`);
        
        // Only include results with relevance score > 0
        if (relevanceScore > 0) {
          results.push({
            ...chunk,
            documentTitle: document.title,
            documentType: document.documentType,
            relevanceScore
          });
        }
      }
    }
    
    // Sort by relevance score (higher is better)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log('DocumentService: Results with score > 0:', results.length);
    if (results.length === 0 && chunks.length > 0) {
      console.log('DEBUG: All chunks had score 0. Sample chunk content:');
      console.log(chunks[0].content.substring(0, 100));
      console.log('Keywords being searched:', keywords);
    }
    
    return results.slice(0, 5); // Return top 5 most relevant chunks
  }

  private calculateRelevanceScore(content: string, keywords: string[], originalQuery: string): number {
    const contentLower = content.toLowerCase();
    const queryLower = originalQuery.toLowerCase();
    
    let score = 0;
    
    // High score for NALT-specific content
    if (contentLower.includes('nalt')) {
      score += 5;
    }
    
    // Keyword matches with improved fuzzy matching
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Direct keyword match
      if (contentLower.includes(keywordLower)) {
        score += 3;
      }
      
      // Fuzzy matching for common variations and misspellings
      const variations: Record<string, string[]> = {
        'inagural': ['inaugural'],
        'inaugural': ['inaugural', 'lecture'],
        'theses': ['thesis', 'dissertation'],
        'dissertations': ['dissertation', 'thesis'], 
        'dissertation': ['dissertation', 'thesis'],
        'thesis': ['thesis', 'dissertation'],
        'lectures': ['lecture', 'inaugural'],
        'lecture': ['lecture', 'inaugural'],
        'cited': ['citation', 'cite', 'footnote', 'bibliography'],
        'cite': ['citation', 'cite', 'footnote', 'bibliography'],
        'citation': ['citation', 'cite', 'footnote', 'bibliography']
      };
      
      const variantList = variations[keywordLower];
      if (variantList) {
        variantList.forEach((variant: string) => {
          if (contentLower.includes(variant)) {
            score += 4;
          }
        });
      }
    });
    
    // Bonus for citation-related terms
    const citationTerms = ['footnote', 'bibliography', 'citation', 'format', 'reference'];
    citationTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 2;
      }
    });
    
    // Give minimal score to any NALT content to ensure it's included
    if (score === 0 && contentLower.includes('nalt')) {
      score = 1;
    }
    
    // Debug logging for scoring issues
    if (keywords.includes('inaugural') || keywords.includes('lecture')) {
      console.log(`DEBUG SCORING for "${content.substring(0, 80)}..."`);
      console.log(`Content includes 'inaugural': ${contentLower.includes('inaugural')}`);
      console.log(`Content includes 'lecture': ${contentLower.includes('lecture')}`);
      console.log(`Content includes 'nalt': ${contentLower.includes('nalt')}`);
      console.log(`Final score: ${score}`);
    }
    
    return score;
  }
  
  private extractKeywords(query: string): string[] {
    // Simple keyword extraction - remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'shall', 'what', 'how', 'when', 'where',
      'who', 'which', 'why', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);
    
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
}

export const documentService = new DocumentService();