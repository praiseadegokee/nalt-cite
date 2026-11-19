import fs from "fs";
import path from "path";
import { 
  users, type User, type InsertUser,
  citationSources, type CitationSource, type InsertCitationSource,
  glossaryTerms, type GlossaryTerm, type InsertGlossaryTerm,
  blogPosts, type BlogPost, type InsertBlogPost,
  resources, type Resource, type InsertResource,
  faqItems, type FaqItem, type InsertFaqItem,
  faqCategories, type FaqCategory, type InsertFaqCategory,
  documents, type Document, type InsertDocument,
  documentChunks, type DocumentChunk, type InsertDocumentChunk,
  chatConversations, type ChatConversation, type InsertChatConversation,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";

// Expanded storage interface with all the CRUD operations for our models
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Citation source methods
  getCitationSources(): Promise<CitationSource[]>;
  getCitationSource(id: number): Promise<CitationSource | undefined>;
  createCitationSource(source: InsertCitationSource): Promise<CitationSource>;
  
  // Glossary term methods
  getGlossaryTerms(letter?: string, category?: string): Promise<GlossaryTerm[]>;
  getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;
  updateGlossaryTerm(id: number, term: InsertGlossaryTerm): Promise<GlossaryTerm | undefined>;
  deleteGlossaryTerm(id: number): Promise<boolean>;
  searchGlossaryTerms(query: string): Promise<GlossaryTerm[]>;
  
  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined>;
  
  // Resource methods
  getResources(category?: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // FAQ category methods
  getFaqCategories(): Promise<FaqCategory[]>;
  getFaqCategory(id: number): Promise<FaqCategory | undefined>;
  createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory>;
  updateFaqCategory(id: number, category: InsertFaqCategory): Promise<FaqCategory | undefined>;
  deleteFaqCategory(id: number): Promise<boolean>;
  
  // FAQ item methods
  getFaqItems(categoryId?: number): Promise<FaqItem[]>;
  getFaqItem(id: number): Promise<FaqItem | undefined>;
  createFaqItem(item: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, item: InsertFaqItem): Promise<FaqItem | undefined>;
  deleteFaqItem(id: number): Promise<boolean>;
  
  // Document methods for RAG
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Document chunk methods
  getDocumentChunks(documentId: number): Promise<DocumentChunk[]>;
  createDocumentChunk(chunk: InsertDocumentChunk): Promise<DocumentChunk>;
  searchDocumentChunks(query: string): Promise<DocumentChunk[]>;
  
  // Chat conversation methods
  getChatConversations(sessionId?: string): Promise<ChatConversation[]>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  deleteChatConversation(id: number, sessionId?: string): Promise<boolean>;
  
  // Chat message methods
  getChatMessages(conversationId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private citationSources: Map<number, CitationSource>;
  private glossaryTerms: Map<number, GlossaryTerm>;
  private blogPosts: Map<number, BlogPost>;
  private resources: Map<number, Resource>;
  private faqCategories: Map<number, FaqCategory>;
  private faqItems: Map<number, FaqItem>;
  private documents: Map<number, Document>;
  private documentChunks: Map<number, DocumentChunk>;
  private chatConversations: Map<number, ChatConversation>;
  private chatMessages: Map<number, ChatMessage>;
  
  private nextId: {
    users: number;
    citationSources: number;
    glossaryTerms: number;
    blogPosts: number;
    resources: number;
    faqCategories: number;
    faqItems: number;
    documents: number;
    documentChunks: number;
    chatConversations: number;
    chatMessages: number;
  };

  constructor() {
    this.users = new Map();
    this.citationSources = new Map();
    this.glossaryTerms = new Map();
    this.blogPosts = new Map();
    this.resources = new Map();
    this.faqCategories = new Map();
    this.faqItems = new Map();
    this.documents = new Map();
    this.documentChunks = new Map();
    this.chatConversations = new Map();
    this.chatMessages = new Map();
    
    this.nextId = {
      users: 1,
      citationSources: 1,
      glossaryTerms: 1,
      blogPosts: 1,
      resources: 1,
      faqCategories: 1,
      faqItems: 1,
      documents: 1,
      documentChunks: 1,
      chatConversations: 1,
      chatMessages: 1,
    };
    
    // Initialize with some sample data for testing
    this.initializeData();
  }
  
  private initializeData() {
    try {
      const seedPath = path.resolve(import.meta.dirname, 'seed-data.json');
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf-8');
        const data = JSON.parse(raw);

        // Seed glossary terms
        if (Array.isArray(data.glossary)) {
          data.glossary.forEach((term: InsertGlossaryTerm) => this.createGlossaryTerm(term));
        }

        // Seed FAQ categories
        const categoryMap = new Map<number, number>();
        if (Array.isArray(data.faqCategories)) {
          data.faqCategories.forEach((cat: InsertFaqCategory, idx: number) => {
            const id = this.nextId.faqCategories++;
            this.faqCategories.set(id, { ...cat, id });
            categoryMap.set(idx + 1, id);
          });
        }

        // Seed FAQ items
        if (Array.isArray(data.faqItems)) {
          data.faqItems.forEach((faq: InsertFaqItem) => {
            const id = this.nextId.faqItems++;
            const categoryId = categoryMap.get(faq.categoryId) || faq.categoryId || 1;
            this.faqItems.set(id, { ...faq, id, categoryId });
          });
        }

        // Seed Blog posts
        if (Array.isArray(data.blogs)) {
          data.blogs.forEach((post: InsertBlogPost) => this.createBlogPost(post));
        }

        console.log(`[Storage] Loaded ${this.glossaryTerms.size} glossary terms, ${this.faqItems.size} FAQs (${this.faqCategories.size} categories), and ${this.blogPosts.size} blog articles from seed-data.json`);
        return;
      }
    } catch (err) {
      console.warn("Failed to load seed-data.json, falling back to defaults", err);
    }

    // Fallback sample glossary terms
    const sampleTerms: InsertGlossaryTerm[] = [
      {
        term: 'Ab Initio',
        definition: 'Latin term meaning "from the beginning" or "from inception." In legal contexts, it is used to indicate that something was invalid, void, or otherwise ineffective from the very start.',
      },
      {
        term: 'Abbreviation',
        definition: 'A shortened form of a written word or phrase used in a citation. The NALT Guide provides specific rules for standard abbreviations of legal sources, journals, and courts.',
      },
      {
        term: 'Academic Journal',
        definition: 'A scholarly periodical publication containing articles written by researchers, professors, and other experts. Legal academic journals publish articles on legal analysis, legal developments, and jurisprudence.',
      },
      {
        term: 'All Nigeria Law Reports (All NLR)',
        definition: 'A series of law reports that contain selected judgments of Nigerian courts. Citations to All NLR include the year, volume, and page number.',
      },
    ];
    
    sampleTerms.forEach(term => this.createGlossaryTerm(term));
    
    // Sample FAQ categories
    const sampleCategories: InsertFaqCategory[] = [
      {
        name: 'General',
        description: 'General information about NALT Citation Guide',
        order: 1,
      },
      {
        name: 'Citation Formats',
        description: 'Specific information about different citation formats',
        order: 2,
      },
      {
        name: 'Technical Help',
        description: 'Technical assistance with using the citation tool',
        order: 3,
      },
    ];
    
    sampleCategories.forEach(async (category) => {
      const newCategory = await this.createFaqCategory(category);
    });
    
    const defaultCategoryId = 1;
    const sampleFaqs: InsertFaqItem[] = [
      {
        question: 'What is the NALT Citation Guide?',
        answer: 'The NALT Citation Guide is the official standard published by the Nigerian Association of Law Teachers for formatting legal citations in academic writing, research papers, and publications in Nigeria.',
        categoryId: defaultCategoryId,
        order: 1,
      },
    ];
    sampleFaqs.forEach(faq => this.createFaqItem(faq));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Citation source methods
  async getCitationSources(): Promise<CitationSource[]> {
    return Array.from(this.citationSources.values());
  }
  
  async getCitationSource(id: number): Promise<CitationSource | undefined> {
    return this.citationSources.get(id);
  }
  
  async createCitationSource(source: InsertCitationSource): Promise<CitationSource> {
    const id = this.nextId.citationSources++;
    const citationSource: CitationSource = { 
      ...source, 
      id,
      description: source.description ?? null,
      defaultFormat: source.defaultFormat ?? null
    };
    this.citationSources.set(id, citationSource);
    return citationSource;
  }
  
  // Glossary term methods
  async getGlossaryTerms(letter?: string, category?: string): Promise<GlossaryTerm[]> {
    let terms = Array.from(this.glossaryTerms.values());
    
    if (letter) {
      terms = terms.filter(term => term.term.charAt(0).toUpperCase() === letter.toUpperCase());
    }
    
    // Category filter removed as we no longer use it
    
    return terms;
  }
  
  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    return this.glossaryTerms.get(id);
  }
  
  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const id = this.nextId.glossaryTerms++;
    const glossaryTerm: GlossaryTerm = { 
      ...term, 
      id,
      category: null // Category is no longer used but kept for database compatibility
    };
    this.glossaryTerms.set(id, glossaryTerm);
    return glossaryTerm;
  }
  
  async updateGlossaryTerm(id: number, term: InsertGlossaryTerm): Promise<GlossaryTerm | undefined> {
    // Check if the term exists
    const existingTerm = this.glossaryTerms.get(id);
    if (!existingTerm) {
      return undefined;
    }
    
    // Update the term
    const updatedTerm: GlossaryTerm = {
      ...existingTerm,
      term: term.term,
      definition: term.definition
      // Keep existing category (null) from existingTerm
    };
    
    this.glossaryTerms.set(id, updatedTerm);
    return updatedTerm;
  }
  
  async deleteGlossaryTerm(id: number): Promise<boolean> {
    // Check if the term exists
    if (!this.glossaryTerms.has(id)) {
      return false;
    }
    
    // Delete the term
    return this.glossaryTerms.delete(id);
  }
  
  async searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
    if (!query) return Array.from(this.glossaryTerms.values());
    
    return Array.from(this.glossaryTerms.values()).filter(term => 
      term.term.toLowerCase().includes(query.toLowerCase()) || 
      term.definition.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.nextId.blogPosts++;
    const blogPost: BlogPost = { 
      ...post, 
      id,
      tags: post.tags ?? null,
      thumbnail: post.thumbnail ?? null
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      return undefined;
    }
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...post,
      id,
      tags: post.tags ?? null,
      thumbnail: post.thumbnail ?? null
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    let resourceList = Array.from(this.resources.values());
    
    if (category && category !== 'all') {
      resourceList = resourceList.filter(resource => resource.category === category);
    }
    
    return resourceList;
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.nextId.resources++;
    const newResource: Resource = { 
      ...resource, 
      id, 
      size: resource.size ?? null 
    };
    this.resources.set(id, newResource);
    return newResource;
  }
  
  // FAQ Category methods
  async getFaqCategories(): Promise<FaqCategory[]> {
    return Array.from(this.faqCategories.values()).sort((a, b) => a.order - b.order);
  }
  
  async getFaqCategory(id: number): Promise<FaqCategory | undefined> {
    return this.faqCategories.get(id);
  }
  
  async createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory> {
    const id = this.nextId.faqCategories++;
    const faqCategory: FaqCategory = { 
      id,
      name: category.name,
      order: category.order || 0, // Ensure order has a default value
      description: category.description ?? null,
    };
    this.faqCategories.set(id, faqCategory);
    return faqCategory;
  }
  
  async updateFaqCategory(id: number, category: InsertFaqCategory): Promise<FaqCategory | undefined> {
    // Check if the category exists
    const existingCategory = this.faqCategories.get(id);
    if (!existingCategory) {
      return undefined;
    }
    
    // Update the category
    const updatedCategory: FaqCategory = {
      ...existingCategory,
      name: category.name,
      description: category.description ?? null,
      order: category.order || 0, // Ensure order is never undefined
    };
    
    this.faqCategories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteFaqCategory(id: number): Promise<boolean> {
    // Check if the category exists and there are no items using it
    if (!this.faqCategories.has(id)) {
      return false;
    }
    
    // Check if any FAQ items are using this category
    const itemsInCategory = Array.from(this.faqItems.values()).filter(item => item.categoryId === id);
    if (itemsInCategory.length > 0) {
      // Cannot delete a category that has items
      return false;
    }
    
    // Delete the category
    return this.faqCategories.delete(id);
  }
  
  // FAQ Item methods
  async getFaqItems(categoryId?: number): Promise<FaqItem[]> {
    let items = Array.from(this.faqItems.values());
    
    if (categoryId) {
      items = items.filter(item => item.categoryId === categoryId);
    }
    
    return items.sort((a, b) => a.order - b.order);
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    return this.faqItems.get(id);
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const id = this.nextId.faqItems++;
    const faqItem: FaqItem = { 
      ...item, 
      id,
      order: item.order ?? 0,
    };
    this.faqItems.set(id, faqItem);
    return faqItem;
  }
  
  async updateFaqItem(id: number, item: InsertFaqItem): Promise<FaqItem | undefined> {
    // Check if the item exists
    const existingItem = this.faqItems.get(id);
    if (!existingItem) {
      return undefined;
    }
    
    // Update the item
    const updatedItem: FaqItem = {
      ...existingItem,
      question: item.question,
      answer: item.answer,
      categoryId: item.categoryId,
      order: item.order ?? existingItem.order,
    };
    
    this.faqItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteFaqItem(id: number): Promise<boolean> {
    // Check if the item exists
    if (!this.faqItems.has(id)) {
      return false;
    }
    
    // Delete the item
    return this.faqItems.delete(id);
  }

  // Document methods for RAG
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.nextId.documents++;
    const document: Document = { 
      ...insertDocument, 
      id,
      uploadedAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    if (!this.documents.has(id)) {
      return false;
    }
    
    // Also delete related chunks
    const chunksToDelete = Array.from(this.documentChunks.values())
      .filter(chunk => chunk.documentId === id);
    
    chunksToDelete.forEach(chunk => {
      this.documentChunks.delete(chunk.id);
    });
    
    return this.documents.delete(id);
  }

  // Document chunk methods
  async getDocumentChunks(documentId: number): Promise<DocumentChunk[]> {
    return Array.from(this.documentChunks.values())
      .filter(chunk => chunk.documentId === documentId)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);
  }

  async createDocumentChunk(insertChunk: InsertDocumentChunk): Promise<DocumentChunk> {
    const id = this.nextId.documentChunks++;
    const chunk: DocumentChunk = { ...insertChunk, id };
    this.documentChunks.set(id, chunk);
    return chunk;
  }

  async searchDocumentChunks(query: string): Promise<DocumentChunk[]> {
    const stopWords = new Set([
      'the','a','an','and','or','but','in','on','at','to','for','of','with',
      'by','from','is','are','was','were','be','been','being','have','has','had',
      'do','does','did','will','would','could','should','may','might','must','can',
      'what','how','when','where','who','which','why','this','that','these','those',
      'i','you','he','she','it','we','they','me','him','her','us','them'
    ]);
    // Tokenize query into meaningful keywords
    const keywords = query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    if (keywords.length === 0) {
      // Fall back to full-string match if no keywords
      const queryLower = query.toLowerCase();
      return Array.from(this.documentChunks.values())
        .filter(chunk => chunk.content.toLowerCase().includes(queryLower))
        .slice(0, 10);
    }

    // Score each chunk by how many keywords it matches
    const scored = Array.from(this.documentChunks.values())
      .map(chunk => {
        const contentLower = chunk.content.toLowerCase();
        const score = keywords.reduce((acc, kw) => acc + (contentLower.includes(kw) ? 1 : 0), 0);
        return { chunk, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ chunk }) => chunk);

    return scored.slice(0, 10); // Return top 10 results
  }

  // Chat conversation methods
  async getChatConversations(sessionId?: string): Promise<ChatConversation[]> {
    return Array.from(this.chatConversations.values())
      .filter(c => !sessionId || c.sessionId === sessionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    return this.chatConversations.get(id);
  }

  async createChatConversation(insertConversation: InsertChatConversation): Promise<ChatConversation> {
    const id = this.nextId.chatConversations++;
    const conversation: ChatConversation = { 
      ...insertConversation, 
      id,
      createdAt: new Date()
    };
    this.chatConversations.set(id, conversation);
    return conversation;
  }

  async deleteChatConversation(id: number, sessionId?: string): Promise<boolean> {
    const conv = this.chatConversations.get(id);
    if (!conv) {
      return false;
    }
    if (sessionId && conv.sessionId !== sessionId) {
      return false;
    }
    
    // Also delete related messages
    const messagesToDelete = Array.from(this.chatMessages.values())
      .filter(message => message.conversationId === id);
    
    messagesToDelete.forEach(message => {
      this.chatMessages.delete(message.id);
    });
    
    return this.chatConversations.delete(id);
  }

  // Chat message methods
  async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.nextId.chatMessages++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
