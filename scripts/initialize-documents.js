import { ragChatService } from '../server/services/ragChatService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDocuments() {
  console.log('Initializing permanent RAG documents...');
  
  try {
    // Process NALT Guide
    const naltPath = path.resolve(__dirname, '../public/pdfs/NALT_Guide.pdf');
    console.log('Processing NALT Guide...');
    const naltResult = await ragChatService.processUploadedDocument(naltPath, 'NALT_Guide.pdf');
    console.log('NALT Guide result:', naltResult);

    // Process OSCOLA Guide  
    const oscolaPath = path.resolve(__dirname, '../public/pdfs/OSCOLA_Guide.pdf');
    console.log('Processing OSCOLA Guide...');
    const oscolaResult = await ragChatService.processUploadedDocument(oscolaPath, 'OSCOLA_Guide.pdf');
    console.log('OSCOLA Guide result:', oscolaResult);

    console.log('Document initialization complete!');
  } catch (error) {
    console.error('Error initializing documents:', error);
  }
}

initializeDocuments();