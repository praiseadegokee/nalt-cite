import { neon } from '@neondatabase/serverless';
import { 
  type User, type InsertUser,
  type CitationSource, type InsertCitationSource,
  type GlossaryTerm, type InsertGlossaryTerm,
  type BlogPost, type InsertBlogPost,
  type Resource, type InsertResource,
  type FaqItem, type InsertFaqItem,
  type FaqCategory, type InsertFaqCategory,
  type Document, type InsertDocument,
  type DocumentChunk, type InsertDocumentChunk,
  type ChatConversation, type InsertChatConversation,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { IStorage } from './storage';

// Create direct SQL connection using Neon
const sqlClient = neon(process.env.DATABASE_URL!);

export class DbStorage implements IStorage {
  // Initialize database connection
  constructor() {
    // Database initialization happens in db.ts when the server starts
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await sqlClient`SELECT * FROM users WHERE id = ${id}`;
    return users[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await sqlClient`SELECT * FROM users WHERE username = ${username}`;
    return users[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await sqlClient`
      INSERT INTO users (username, password_hash)
      VALUES (${user.username}, ${user.password})
      RETURNING *
    `;
    return result[0] as User;
  }
  
  // Citation source methods
  async getCitationSources(): Promise<CitationSource[]> {
    const sources = await sqlClient`SELECT * FROM citation_sources`;
    return sources as CitationSource[];
  }
  
  async getCitationSource(id: number): Promise<CitationSource | undefined> {
    const sources = await sqlClient`SELECT * FROM citation_sources WHERE id = ${id}`;
    return sources[0] as CitationSource | undefined;
  }
  
  async createCitationSource(source: InsertCitationSource): Promise<CitationSource> {
    const result = await sqlClient`
      INSERT INTO citation_sources (name, description, default_format)
      VALUES (${source.name}, ${source.description || null}, ${source.defaultFormat || null})
      RETURNING *
    `;
    return result[0] as CitationSource;
  }
  
  // Glossary term methods
  async getGlossaryTerms(letter?: string, category?: string): Promise<GlossaryTerm[]> {
    let result;
    
    if (letter) {
      // Filter by first letter (case insensitive)
      result = await sqlClient`
        SELECT * FROM glossary_terms 
        WHERE UPPER(SUBSTRING(term, 1, 1)) = UPPER(${letter})
        ORDER BY term ASC
      `;
    } else {
      // Get all terms
      result = await sqlClient`SELECT * FROM glossary_terms ORDER BY term ASC`;
    }
    
    return result as GlossaryTerm[];
  }
  
  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    const terms = await sqlClient`SELECT * FROM glossary_terms WHERE id = ${id}`;
    return terms[0] as GlossaryTerm | undefined;
  }
  
  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const result = await sqlClient`
      INSERT INTO glossary_terms (term, definition, category)
      VALUES (${term.term}, ${term.definition}, NULL)
      RETURNING *
    `;
    return result[0] as GlossaryTerm;
  }
  
  async updateGlossaryTerm(id: number, term: InsertGlossaryTerm): Promise<GlossaryTerm | undefined> {
    // First check if the term exists
    const exists = await this.getGlossaryTerm(id);
    if (!exists) {
      return undefined;
    }
    
    // Update the term
    const result = await sqlClient`
      UPDATE glossary_terms 
      SET term = ${term.term}, definition = ${term.definition}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0] as GlossaryTerm | undefined;
  }
  
  async deleteGlossaryTerm(id: number): Promise<boolean> {
    // First check if the term exists
    const exists = await this.getGlossaryTerm(id);
    if (!exists) {
      return false;
    }
    
    // Delete the term
    await sqlClient`DELETE FROM glossary_terms WHERE id = ${id}`;
    return true;
  }
  
  async searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
    if (!query) {
      return this.getGlossaryTerms();
    }
    
    const result = await sqlClient`
      SELECT * FROM glossary_terms 
      WHERE term ILIKE ${'%' + query + '%'} OR definition ILIKE ${'%' + query + '%'}
      ORDER BY term ASC
    `;
    
    return result as GlossaryTerm[];
  }
  
  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    const posts = await sqlClient`SELECT * FROM blog_posts ORDER BY date DESC`;
    return posts as BlogPost[];
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const posts = await sqlClient`SELECT * FROM blog_posts WHERE id = ${id}`;
    return posts[0] as BlogPost | undefined;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await sqlClient`
      INSERT INTO blog_posts (title, excerpt, content, date, author, read_time, category, tags)
      VALUES (${post.title}, ${post.excerpt}, ${post.content}, ${post.date}, 
              ${post.author}, ${post.readTime}, ${post.category}, ${post.tags || null})
      RETURNING *
    `;
    return result[0] as BlogPost;
  }
  
  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    let result;
    
    if (category && category !== 'all') {
      result = await sqlClient`SELECT * FROM resources WHERE category = ${category}`;
    } else {
      result = await sqlClient`SELECT * FROM resources`;
    }
    
    return result as Resource[];
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    const resources = await sqlClient`SELECT * FROM resources WHERE id = ${id}`;
    return resources[0] as Resource | undefined;
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await sqlClient`
      INSERT INTO resources (title, description, download_url, type, category, size)
      VALUES (${resource.title}, ${resource.description}, ${resource.downloadUrl}, 
              ${resource.type}, ${resource.category}, ${resource.size || null})
      RETURNING *
    `;
    return result[0] as Resource;
  }
  
  // FAQ Category methods
  async getFaqCategories(): Promise<FaqCategory[]> {
    const categories = await sqlClient`SELECT * FROM faq_categories ORDER BY order_num ASC`;
    return categories as FaqCategory[];
  }
  
  async getFaqCategory(id: number): Promise<FaqCategory | undefined> {
    const categories = await sqlClient`SELECT * FROM faq_categories WHERE id = ${id}`;
    return categories[0] as FaqCategory | undefined;
  }
  
  async createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory> {
    const result = await sqlClient`
      INSERT INTO faq_categories (name, description, order_num)
      VALUES (${category.name}, ${category.description || null}, ${category.order || 0})
      RETURNING *
    `;
    return result[0] as FaqCategory;
  }
  
  async updateFaqCategory(id: number, category: InsertFaqCategory): Promise<FaqCategory | undefined> {
    // First check if the category exists
    const exists = await this.getFaqCategory(id);
    if (!exists) {
      return undefined;
    }
    
    // Update the category
    const result = await sqlClient`
      UPDATE faq_categories 
      SET name = ${category.name}, 
          description = ${category.description || null}, 
          order_num = ${category.order || 0}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0] as FaqCategory | undefined;
  }
  
  async deleteFaqCategory(id: number): Promise<boolean> {
    // First check if the category exists
    const exists = await this.getFaqCategory(id);
    if (!exists) {
      return false;
    }
    
    // Check if any items reference this category
    const itemsInCategory = await sqlClient`
      SELECT COUNT(*) as count FROM faq_items WHERE category_id = ${id}
    `;
    
    if (parseInt(itemsInCategory[0].count) > 0) {
      // Cannot delete a category that has items
      return false;
    }
    
    // Delete the category
    await sqlClient`DELETE FROM faq_categories WHERE id = ${id}`;
    return true;
  }
  
  // FAQ Item methods
  async getFaqItems(categoryId?: number): Promise<FaqItem[]> {
    let result;
    
    if (categoryId) {
      // Filter by category
      result = await sqlClient`
        SELECT * FROM faq_items 
        WHERE category_id = ${categoryId}
        ORDER BY order_num ASC
      `;
    } else {
      // Get all items
      result = await sqlClient`SELECT * FROM faq_items ORDER BY order_num ASC`;
    }
    
    return result as FaqItem[];
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    const items = await sqlClient`SELECT * FROM faq_items WHERE id = ${id}`;
    return items[0] as FaqItem | undefined;
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const result = await sqlClient`
      INSERT INTO faq_items (question, answer, category_id, order_num)
      VALUES (${item.question}, ${item.answer}, ${item.categoryId}, ${item.order || 0})
      RETURNING *
    `;
    return result[0] as FaqItem;
  }
  
  async updateFaqItem(id: number, item: InsertFaqItem): Promise<FaqItem | undefined> {
    // First check if the item exists
    const exists = await this.getFaqItem(id);
    if (!exists) {
      return undefined;
    }
    
    // Log existing and new values for debugging
    console.log("Existing FAQ item:", exists);
    console.log("Update with:", item);
    
    // Update the item - using the correct fields
    // Database columns are: id, question, answer, category_id, order_num
    // But in our typescript models we use: id, question, answer, categoryId, order
    const result = await sqlClient`
      UPDATE faq_items 
      SET question = ${item.question}, 
          answer = ${item.answer}, 
          category_id = ${item.categoryId},
          order_num = ${item.order !== undefined ? item.order : exists.order}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0] as FaqItem | undefined;
  }
  
  async deleteFaqItem(id: number): Promise<boolean> {
    // First check if the item exists
    const exists = await this.getFaqItem(id);
    if (!exists) {
      return false;
    }
    
    // Delete the item
    await sqlClient`DELETE FROM faq_items WHERE id = ${id}`;
    return true;
  }

  // Document methods for RAG
  async getDocuments(): Promise<Document[]> {
    const documents = await sqlClient`SELECT * FROM documents ORDER BY uploaded_at DESC`;
    return documents as Document[];
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const documents = await sqlClient`SELECT * FROM documents WHERE id = ${id}`;
    return documents[0] as Document | undefined;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const result = await sqlClient`
      INSERT INTO documents (filename, title, content, document_type, uploaded_at)
      VALUES (${document.filename}, ${document.title}, ${document.content}, ${document.documentType}, NOW())
      RETURNING *
    `;
    return result[0] as Document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const exists = await this.getDocument(id);
    if (!exists) {
      return false;
    }
    
    // Delete related chunks first
    await sqlClient`DELETE FROM document_chunks WHERE document_id = ${id}`;
    
    // Delete the document
    await sqlClient`DELETE FROM documents WHERE id = ${id}`;
    return true;
  }

  // Document chunk methods
  async getDocumentChunks(documentId: number): Promise<DocumentChunk[]> {
    const chunks = await sqlClient`
      SELECT * FROM document_chunks 
      WHERE document_id = ${documentId} 
      ORDER BY chunk_index
    `;
    return chunks as DocumentChunk[];
  }

  async createDocumentChunk(chunk: InsertDocumentChunk): Promise<DocumentChunk> {
    const result = await sqlClient`
      INSERT INTO document_chunks (document_id, content, chunk_index, embedding)
      VALUES (${chunk.documentId}, ${chunk.content}, ${chunk.chunkIndex}, ${chunk.embedding || null})
      RETURNING *
    `;
    return result[0] as DocumentChunk;
  }

  async searchDocumentChunks(query: string): Promise<DocumentChunk[]> {
    const chunks = await sqlClient`
      SELECT * FROM document_chunks 
      WHERE content ILIKE ${'%' + query + '%'}
      LIMIT 10
    `;
    return chunks as DocumentChunk[];
  }

  // Chat conversation methods
  async getChatConversations(): Promise<ChatConversation[]> {
    const conversations = await sqlClient`
      SELECT * FROM chat_conversations 
      ORDER BY created_at DESC
    `;
    return conversations as ChatConversation[];
  }

  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    const conversations = await sqlClient`SELECT * FROM chat_conversations WHERE id = ${id}`;
    return conversations[0] as ChatConversation | undefined;
  }

  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const result = await sqlClient`
      INSERT INTO chat_conversations (title, created_at)
      VALUES (${conversation.title}, NOW())
      RETURNING *
    `;
    return result[0] as ChatConversation;
  }

  async deleteChatConversation(id: number): Promise<boolean> {
    const exists = await this.getChatConversation(id);
    if (!exists) {
      return false;
    }
    
    // Delete related messages first
    await sqlClient`DELETE FROM chat_messages WHERE conversation_id = ${id}`;
    
    // Delete the conversation
    await sqlClient`DELETE FROM chat_conversations WHERE id = ${id}`;
    return true;
  }

  // Chat message methods
  async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
    const messages = await sqlClient`
      SELECT * FROM chat_messages 
      WHERE conversation_id = ${conversationId} 
      ORDER BY created_at
    `;
    return messages as ChatMessage[];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await sqlClient`
      INSERT INTO chat_messages (conversation_id, role, content, sources, created_at)
      VALUES (${message.conversationId}, ${message.role}, ${message.content}, ${message.sources || null}, NOW())
      RETURNING *
    `;
    return result[0] as ChatMessage;
  }
}

// Export a singleton instance of the DbStorage
export const dbStorage = new DbStorage();