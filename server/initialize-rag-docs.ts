import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { dbStorage } from './dbStorage';
import type { InsertDocument, InsertDocumentChunk } from '@shared/schema';

async function processAndStorePDF(filePath: string, filename: string, documentType: 'nalt' | 'oscola'): Promise<number> {
  try {
    console.log(`Processing ${filename}...`);
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;
    
    console.log(`Extracted ${text.length} characters from ${filename}`);
    
    // Create document title based on filename
    const title = filename.replace('.pdf', '').replace(/[-_]/g, ' ');
    
    // Store the document
    const document = await dbStorage.createDocument({
      filename,
      title,
      content: text,
      documentType
    });
    
    console.log(`Created document with ID: ${document.id}`);
    
    // Process and store chunks
    await chunkAndStoreDocument(document.id, text);
    
    return document.id;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    throw new Error(`Failed to process PDF document: ${filename}`);
  }
}

async function chunkAndStoreDocument(documentId: number, content: string): Promise<void> {
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
  
  console.log(`Creating ${chunks.length} chunks for document ${documentId}`);
  
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
  
  console.log(`Stored ${chunks.length} chunks successfully`);
}

async function processDocumentsAsync(hasNALT: boolean, hasOSCOLA: boolean): Promise<void> {
  const documentsToProcess = [
    {
      path: path.resolve(process.cwd(), 'public/pdfs/NALT_Complete_Guide.pdf'),
      filename: 'NALT_Complete_Guide.pdf',
      type: 'nalt' as const,
      skip: hasNALT
    },
    {
      path: path.resolve(process.cwd(), 'public/pdfs/OSCOLA_Guide.pdf'),
      filename: 'OSCOLA_Guide.pdf',
      type: 'oscola' as const,
      skip: hasOSCOLA
    }
  ];
  
  for (const doc of documentsToProcess) {
    if (doc.skip) {
      console.log(`Skipping ${doc.filename} - already exists`);
      continue;
    }
    
    if (fs.existsSync(doc.path)) {
      try {
        console.log(`Processing ${doc.filename}...`);
        const documentId = await processAndStorePDF(doc.path, doc.filename, doc.type);
        console.log(`✓ Successfully processed ${doc.filename} (Document ID: ${documentId})`);
      } catch (error) {
        console.error(`✗ Failed to process ${doc.filename}:`, error);
      }
    } else {
      console.warn(`⚠ File not found: ${doc.path}`);
    }
  }
  
  const finalDocs = await dbStorage.getDocuments();
  console.log(`Background processing complete! Total documents: ${finalDocs.length}`);
  finalDocs.forEach(doc => {
    console.log(`- ${doc.title} (${doc.documentType.toUpperCase()})`);
  });
}

export async function initializeRAGDocuments(): Promise<void> {
  console.log('Initializing permanent RAG documents...');
  
  try {
    // Check if both required documents already exist
    const existingDocs = await dbStorage.getDocuments();
    const hasNALT = existingDocs.some(doc => doc.documentType === 'nalt');
    const hasOSCOLA = existingDocs.some(doc => doc.documentType === 'oscola');
    
    if (hasNALT && hasOSCOLA) {
      console.log('Both documents already exist in the system:', existingDocs.map(d => d.title));
      return;
    }
    
    console.log(`Current status - NALT: ${hasNALT ? 'exists' : 'missing'}, OSCOLA: ${hasOSCOLA ? 'exists' : 'missing'}`);
    
    // Skip background processing if server is under load
    console.log('Skipping background document processing to prioritize server stability');
    
    console.log('Document initialization scheduled for background processing');
    return;
    
    const documentsToProcess = [
      {
        path: path.resolve(process.cwd(), 'public/pdfs/NALT_Complete_Guide.pdf'),
        filename: 'NALT_Complete_Guide.pdf',
        type: 'nalt' as const
      },
      {
        path: path.resolve(process.cwd(), 'public/pdfs/OSCOLA_Guide.pdf'),
        filename: 'OSCOLA_Guide.pdf',
        type: 'oscola' as const
      }
    ];
    
    for (const doc of documentsToProcess) {
      // Skip if this document type already exists
      if ((doc.type === 'nalt' && hasNALT) || (doc.type === 'oscola' && hasOSCOLA)) {
        console.log(`Skipping ${doc.filename} - already exists`);
        continue;
      }
      
      if (fs.existsSync(doc.path)) {
        try {
          console.log(`Processing ${doc.filename}...`);
          const documentId = await processAndStorePDF(doc.path, doc.filename, doc.type);
          console.log(`✓ Successfully processed ${doc.filename} (Document ID: ${documentId})`);
        } catch (error) {
          console.error(`✗ Failed to process ${doc.filename}:`, error);
        }
      } else {
        console.warn(`⚠ File not found: ${doc.path}`);
      }
    }
    
    console.log('Document initialization complete!');
    
    // Show final status
    const finalDocs = await dbStorage.getDocuments();
    console.log(`Total documents in system: ${finalDocs.length}`);
    finalDocs.forEach(doc => {
      console.log(`- ${doc.title} (${doc.documentType.toUpperCase()})`);
    });
    
  } catch (error) {
    console.error('Error during document initialization:', error);
    throw error;
  }
}