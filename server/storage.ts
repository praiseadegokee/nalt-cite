import { 
  users, type User, type InsertUser,
  citationSources, type CitationSource, type InsertCitationSource,
  glossaryTerms, type GlossaryTerm, type InsertGlossaryTerm,
  blogPosts, type BlogPost, type InsertBlogPost,
  resources, type Resource, type InsertResource,
  faqItems, type FaqItem, type InsertFaqItem,
  faqCategories, type FaqCategory, type InsertFaqCategory
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private citationSources: Map<number, CitationSource>;
  private glossaryTerms: Map<number, GlossaryTerm>;
  private blogPosts: Map<number, BlogPost>;
  private resources: Map<number, Resource>;
  private faqCategories: Map<number, FaqCategory>;
  private faqItems: Map<number, FaqItem>;
  
  private nextId: {
    users: number;
    citationSources: number;
    glossaryTerms: number;
    blogPosts: number;
    resources: number;
    faqCategories: number;
    faqItems: number;
  };

  constructor() {
    this.users = new Map();
    this.citationSources = new Map();
    this.glossaryTerms = new Map();
    this.blogPosts = new Map();
    this.resources = new Map();
    this.faqCategories = new Map();
    this.faqItems = new Map();
    
    this.nextId = {
      users: 1,
      citationSources: 1,
      glossaryTerms: 1,
      blogPosts: 1,
      resources: 1,
      faqCategories: 1,
      faqItems: 1,
    };
    
    // Initialize with some sample data for testing
    this.initializeData();
  }
  
  private initializeData() {
    // Sample glossary terms
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
    
    // Create categories and store their IDs
    const categoryIds: Record<string, number> = {};
    sampleCategories.forEach(async (category) => {
      const newCategory = await this.createFaqCategory(category);
      categoryIds[category.name] = newCategory.id;
    });
    
    // Ensure at least one category exists for sample data
    const defaultCategoryId = 1;
    
    // Sample FAQ items
    const sampleFaqs: InsertFaqItem[] = [
      {
        question: 'What is the NALT Citation Guide?',
        answer: 'The NALT Citation Guide is the official standard published by the Nigerian Association of Law Teachers for formatting legal citations in academic writing, research papers, and publications in Nigeria. It provides comprehensive rules for citing various legal sources including cases, statutes, books, journal articles, and other materials relevant to Nigerian legal scholarship.',
        categoryId: defaultCategoryId,
        order: 1,
      },
      {
        question: 'How does NALT citation differ from OSCOLA?',
        answer: 'While NALT citation format shares some similarities with the Oxford Standard for Citation of Legal Authorities (OSCOLA), it has been specifically adapted for the Nigerian legal system. Key differences include specialized rules for citing Nigerian cases, statutes, and legal materials, as well as variations in punctuation, abbreviation conventions, and formatting requirements tailored to Nigerian legal scholarship practices.',
        categoryId: defaultCategoryId,
        order: 2,
      },
      {
        question: 'How do I cite Nigerian court cases?',
        answer: 'Nigerian court cases should be cited following this format: <i>Case Name</i> [Year] Volume Law Report Abbreviation Starting Page. For example: <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550. If citing a specific page, add the page number after the starting page, e.g., <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550, 575.',
        categoryId: defaultCategoryId,
        order: 3,
      },
    ];
    
    sampleFaqs.forEach(faq => this.createFaqItem(faq));
    
    // Sample blog posts
    const sampleBlogPosts: InsertBlogPost[] = [
      {
        title: 'Understanding the New NALT Citation Rules for Online Sources',
        excerpt: 'The digital age has brought new challenges for legal citation. Learn how the latest NALT Guide addresses electronic resources, social media citations, and other digital materials in legal writing.',
        content: '<p>The digital revolution has transformed legal research and writing, bringing with it new challenges for citation standards. The Nigerian Association of Law Teachers has responded by updating the NALT Citation Guide to address electronic resources, online databases, social media content, and other digital materials that are increasingly being cited in legal scholarship.</p><p>This article explores the key changes in the latest edition of the NALT Guide, providing practical examples and clarity on how to properly cite everything from online journal articles to social media posts in your legal writing.</p>',
        date: '2023-09-15',
        author: 'Dr. Amina Bello',
        readTime: 8,
        category: 'Citation Tips',
        tags: JSON.stringify(['Digital Resources', 'Online Citation', 'NALT Updates', 'Legal Writing'])
      },
      {
        title: 'Common Citation Mistakes in Nigerian Legal Writing',
        excerpt: 'Explore the most frequent errors in legal citations and how to avoid them in your academic papers and legal documents.',
        content: '<p>Even experienced legal scholars can make citation errors that may diminish the credibility and clarity of their work. This article identifies the most common citation mistakes found in Nigerian legal writing and provides guidance on how to avoid them.</p><p>From inconsistent formatting of case names to incorrect abbreviations of law reports, understanding these pitfalls will help you produce more professional and accurate legal documents that adhere properly to NALT citation standards.</p>',
        date: '2023-10-05',
        author: 'Prof. Emmanuel Okonkwo',
        readTime: 6,
        category: 'Best Practices',
        tags: JSON.stringify(['Common Errors', 'Citation Format', 'Legal Writing', 'NALT Standards'])
      }
    ];
    
    sampleBlogPosts.forEach(post => this.createBlogPost(post));
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
      tags: post.tags ?? null 
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
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
}

export const storage = new MemStorage();
