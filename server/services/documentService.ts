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
      
      // Try to break at a sentence boundary near the end
      if (endIndex < content.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > startIndex + chunkSize * 0.7) {
          chunk = content.slice(startIndex, breakPoint + 1);
        }
      }
      
      chunks.push(chunk.trim());
      startIndex = endIndex - overlap;
    }
    
    // Store chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunkData: InsertDocumentChunk = {
        documentId,
        content: chunks[i],
        chunkIndex: i,
        embedding: null // We'll use simple text search instead of embeddings
      };
      
      await dbStorage.createDocumentChunk(chunkData);
    }
  }
  
  async searchDocuments(query: string): Promise<{ content: string; documentTitle: string; chunkIndex: number }[]> {
    try {
      console.log('DocumentService: Searching for query:', query);
      const chunks = await dbStorage.searchDocumentChunks(query);
      console.log('DocumentService: Found chunks from DB:', chunks.length);
      
      const results = [];
      for (const chunk of chunks) {
        // Access fields directly from database result (snake_case)
        const documentId = (chunk as any).document_id;
        const chunkIndex = (chunk as any).chunk_index;
        
        console.log('Processing chunk for document ID:', documentId, 'chunk index:', chunkIndex);
        if (documentId) {
          const document = await dbStorage.getDocument(documentId);
          console.log('Found document:', document ? document.title : 'NOT FOUND');
          if (document) {
            results.push({
              content: chunk.content,
              documentTitle: document.title,
              chunkIndex: chunkIndex || 0
            });
          }
        } else {
          console.log('No document_id found in chunk:', Object.keys(chunk));
        }
      }
      
      console.log('DocumentService: Returning results:', results.length);
      return results;
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }
  
  async getAvailableDocuments() {
    return await dbStorage.getDocuments();
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return await dbStorage.deleteDocument(id);
  }
}

export const documentService = new DocumentService();