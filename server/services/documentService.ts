import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { dbStorage } from '../dbStorage';
import type { InsertDocument, InsertDocumentChunk } from '@shared/schema';

export class DocumentService {
  
  async processAndStorePDF(filePath: string, filename: string, documentType: 'nalt' | 'oscola'): Promise<number> {
    try {
      // Read the PDF file
      const pdfBuffer = fs.readFileSync(filePath);
      
      // Extract text from PDF
      const pdfData = await pdf(pdfBuffer);
      const text = pdfData.text;
      
      // Create document title based on filename
      const title = filename.replace('.pdf', '').replace(/[-_]/g, ' ');
      
      // Store the document
      const document = await dbStorage.createDocument({
        filename,
        title,
        content: text,
        documentType
      });
      
      // Process and store chunks
      await this.chunkAndStoreDocument(document.id, text);
      
      return document.id;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF document');
    }
  }
  
  private async chunkAndStoreDocument(documentId: number, content: string): Promise<void> {
    // Split content into chunks of approximately 1000 characters
    const chunkSize = 1000;
    const overlap = 200; // Overlap between chunks for better context
    
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
        const document = await dbStorage.getDocument(chunk.documentId);
        if (document) {
          results.push({
            content: chunk.content,
            documentTitle: document.title,
            chunkIndex: chunk.chunkIndex
          });
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