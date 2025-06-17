const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Simple direct approach to process NALT guide
async function processNALTGuide() {
  try {
    console.log('Starting NALT guide processing...');
    
    // Use the existing complete NALT file
    const filePath = path.join(process.cwd(), 'public/pdfs/NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf');
    
    if (!fs.existsSync(filePath)) {
      console.error('NALT file not found');
      return;
    }
    
    console.log('Reading NALT PDF file...');
    const pdfBuffer = fs.readFileSync(filePath);
    
    console.log('Extracting text...');
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;
    
    console.log(`Extracted ${text.length} characters from NALT guide`);
    
    // Make direct API call to store the document
    const fetch = (await import('node-fetch')).default;
    
    const formData = new (await import('form-data')).default();
    formData.append('file', fs.createReadStream(filePath), {
      filename: 'NALT_Guide.pdf',
      contentType: 'application/pdf'
    });
    
    console.log('Uploading to RAG system...');
    const response = await fetch('http://localhost:5000/api/chat/upload-document', {
      method: 'POST',
      body: formData,
      timeout: 300000 // 5 minutes timeout
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
    
  } catch (error) {
    console.error('Error processing NALT guide:', error.message);
  }
}

processNALTGuide();