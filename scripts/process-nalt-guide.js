import { initializeRAGDocuments } from '../server/initialize-rag-docs.js';
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { dbStorage } from '../server/dbStorage.js';

async function processNALTGuide() {
  try {
    console.log('Processing NALT Complete Guide...');
    
    const filePath = path.resolve(process.cwd(), 'public/pdfs/NALT_Complete_Guide.pdf');
    
    if (!fs.existsSync(filePath)) {
      console.error('NALT Complete Guide file not found');
      return;
    }
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;
    
    console.log(`Extracted ${text.length} characters from NALT Complete Guide`);
    
    // Store the document
    const document = await dbStorage.createDocument({
      filename: 'NALT_Complete_Guide.pdf',
      title: 'NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria',
      content: text,
      documentType: 'nalt'
    });
    
    console.log(`Created NALT document with ID: ${document.id}`);
    
    // Process and store chunks
    await chunkAndStoreDocument(document.id, text);
    
    console.log('NALT Complete Guide processed successfully!');
    
  } catch (error) {
    console.error('Error processing NALT Complete Guide:', error);
  }
}

async function chunkAndStoreDocument(documentId, content) {
  const chunkSize = 1000;
  const overlap = 200;
  
  const chunks = [];
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
    const chunkData = {
      documentId,
      content: chunks[i],
      chunkIndex: i,
      embedding: null
    };
    
    await dbStorage.createDocumentChunk(chunkData);
  }
  
  console.log(`Stored ${chunks.length} chunks successfully`);
}

processNALTGuide();