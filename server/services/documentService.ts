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
        content: chunks[i],
        metadata: null
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
    for (const chunk of chunks) {
      const document = await dbStorage.getDocument(chunk.documentId);
      if (document) {
        // Calculate relevance score based on keyword matches
        const relevanceScore = this.calculateRelevanceScore(chunk.content, keywords, query);
        
        results.push({
          ...chunk,
          documentTitle: document.title,
          documentType: document.documentType,
          relevanceScore
        });
      }
    }
    
    // Sort by relevance score (higher is better)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log('DocumentService: Returning results:', results.length);
    return results.slice(0, 5); // Return top 5 most relevant chunks
  }

  private calculateRelevanceScore(content: string, keywords: string[], originalQuery: string): number {
    const contentLower = content.toLowerCase();
    const queryLower = originalQuery.toLowerCase();
    
    let score = 0;
    
    // Exact query match gets highest score
    if (contentLower.includes(queryLower)) {
      score += 10;
    }
    
    // Keyword matches
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const matches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
      score += matches * 2;
    });
    
    // Bonus for citation-related terms
    const citationTerms = ['cite', 'citation', 'format', 'reference', 'footnote', 'bibliography'];
    citationTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 1;
      }
    });
    
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