import { dbStorage } from './dbStorage';
import type { InsertDocument, InsertDocumentChunk } from '@shared/schema';

async function addFAQsToKnowledgeBase(): Promise<void> {
  try {
    console.log('Adding FAQ content to knowledge base...');
    
    // Get all FAQ items with their categories
    const faqItems = await dbStorage.getFaqItems();
    const faqCategories = await dbStorage.getFaqCategories();
    
    if (faqItems.length === 0) {
      console.log('No FAQ items found to add to knowledge base');
      return;
    }
    
    // Create a document entry for FAQ content
    const faqDocument: InsertDocument = {
      title: 'NALT FAQ Knowledge Base',
      filename: 'nalt-faq-kb.txt',
      content: 'Frequently Asked Questions about NALT Citation Format',
      documentType: 'nalt'
    };
    
    // Check if FAQ document already exists
    const existingDocuments = await dbStorage.getDocuments();
    let faqDocumentId: number;
    
    const existingFaqDoc = existingDocuments.find(doc => doc.title === 'NALT FAQ Knowledge Base');
    if (existingFaqDoc) {
      console.log('FAQ document already exists, updating chunks...');
      faqDocumentId = existingFaqDoc.id;
      
      // Remove existing FAQ chunks to avoid duplicates
      const existingChunks = await dbStorage.getDocumentChunks(faqDocumentId);
      for (const chunk of existingChunks) {
        // Note: We'd need a delete method for chunks, but for now we'll just add new ones
      }
    } else {
      console.log('Creating new FAQ document...');
      const createdDocument = await dbStorage.createDocument(faqDocument);
      faqDocumentId = createdDocument.id;
    }
    
    // Create category map for better organization
    const categoryMap = new Map<number, string>();
    faqCategories.forEach(cat => {
      categoryMap.set(cat.id, cat.name);
    });
    
    // Process each FAQ item into chunks
    let chunkIndex = 0;
    for (const faq of faqItems) {
      const categoryName = categoryMap.get(faq.categoryId) || 'General';
      
      // Create a comprehensive chunk that includes question, answer, and context
      const chunkContent = `NALT FAQ - ${categoryName}: ${faq.question}

Answer: ${faq.answer}

Category: ${categoryName}
Topic: Citation guidance and formatting rules`;
      
      const chunk: InsertDocumentChunk = {
        documentId: faqDocumentId,
        content: chunkContent,
        chunkIndex,
        embedding: JSON.stringify({
          type: 'faq',
          category: categoryName,
          question: faq.question,
          faqId: faq.id
        })
      };
      
      await dbStorage.createDocumentChunk(chunk);
      console.log(`Added FAQ chunk ${chunkIndex + 1}: "${faq.question.substring(0, 50)}..."`);
      chunkIndex++;
    }
    
    console.log(`Successfully added ${faqItems.length} FAQ items to knowledge base as chunks`);
    
  } catch (error) {
    console.error('Error adding FAQs to knowledge base:', error);
    throw error;
  }
}

// Export the function for use in other modules
export { addFAQsToKnowledgeBase };

// Allow direct execution if run as script
if (import.meta.url === `file://${process.argv[1]}`) {
  addFAQsToKnowledgeBase()
    .then(() => {
      console.log('FAQ knowledge base update completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('FAQ knowledge base update failed:', error);
      process.exit(1);
    });
}