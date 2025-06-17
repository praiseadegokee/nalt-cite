import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { dbStorage } from './dbStorage';
import type { InsertDocument, InsertDocumentChunk } from '@shared/schema';

async function processNALTGuide() {
  try {
    console.log('Processing NALT Complete Guide directly...');
    
    const filePath = path.resolve(process.cwd(), 'public/pdfs/NALT_Complete_Guide.pdf');
    
    if (!fs.existsSync(filePath)) {
      console.error('NALT Complete Guide file not found at:', filePath);
      return;
    }
    
    // Read the PDF file
    console.log('Reading PDF file...');
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;
    
    console.log(`Extracted ${text.length} characters from NALT Complete Guide`);
    
    // Store the document
    console.log('Storing document in database...');
    const document = await dbStorage.createDocument({
      filename: 'NALT_Complete_Guide.pdf',
      title: 'NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria',
      content: text,
      documentType: 'nalt'
    });
    
    console.log(`Created NALT document with ID: ${document.id}`);
    
    // Process and store chunks
    console.log('Processing and storing chunks...');
    await chunkAndStoreDocument(document.id, text);
    
    console.log('✓ NALT Complete Guide processed successfully!');
    
    // Show final document count
    const allDocs = await dbStorage.getDocuments();
    console.log(`Total documents in system: ${allDocs.length}`);
    allDocs.forEach(doc => {
      console.log(`- ${doc.title} (${doc.documentType.toUpperCase()})`);
    });
    
  } catch (error) {
    console.error('Error processing NALT Complete Guide:', error);
  }
}

async function chunkAndStoreDocument(documentId: number, content: string): Promise<void> {
  const chunkSize = 1000;
  const overlap = 200;
  
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + chunkSize, content.length);
    let chunk = content.slice(startIndex, endIndex);
    
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
  
  console.log(`Creating ${chunks.length} chunks for document ${documentId}`);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunkData: InsertDocumentChunk = {
      documentId,
      content: chunks[i],
      chunkIndex: i,
      embedding: null
    };
    
    await dbStorage.createDocumentChunk(chunkData);
  }
  
  console.log(`Stored ${chunks.length} chunks successfully`);
}

// Execute the function
processNALTGuide().then(() => {
  console.log('Process completed');
  process.exit(0);
}).catch(error => {
  console.error('Process failed:', error);
  process.exit(1);
});