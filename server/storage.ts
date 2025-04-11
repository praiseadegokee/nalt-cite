import { 
  users, type User, type InsertUser,
  citationSources, type CitationSource, type InsertCitationSource,
  glossaryTerms, type GlossaryTerm, type InsertGlossaryTerm,
  blogPosts, type BlogPost, type InsertBlogPost,
  resources, type Resource, type InsertResource,
  faqItems, type FaqItem, type InsertFaqItem
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
  searchGlossaryTerms(query: string): Promise<GlossaryTerm[]>;
  
  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Resource methods
  getResources(category?: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // FAQ methods
  getFaqItems(): Promise<FaqItem[]>;
  getFaqItem(id: number): Promise<FaqItem | undefined>;
  createFaqItem(item: InsertFaqItem): Promise<FaqItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private citationSources: Map<number, CitationSource>;
  private glossaryTerms: Map<number, GlossaryTerm>;
  private blogPosts: Map<number, BlogPost>;
  private resources: Map<number, Resource>;
  private faqItems: Map<number, FaqItem>;
  
  private nextId: {
    users: number;
    citationSources: number;
    glossaryTerms: number;
    blogPosts: number;
    resources: number;
    faqItems: number;
  };

  constructor() {
    this.users = new Map();
    this.citationSources = new Map();
    this.glossaryTerms = new Map();
    this.blogPosts = new Map();
    this.resources = new Map();
    this.faqItems = new Map();
    
    this.nextId = {
      users: 1,
      citationSources: 1,
      glossaryTerms: 1,
      blogPosts: 1,
      resources: 1,
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
        category: 'legal',
      },
      {
        term: 'Abbreviation',
        definition: 'A shortened form of a written word or phrase used in a citation. The NALT Guide provides specific rules for standard abbreviations of legal sources, journals, and courts.',
        category: 'citation',
      },
      {
        term: 'Academic Journal',
        definition: 'A scholarly periodical publication containing articles written by researchers, professors, and other experts. Legal academic journals publish articles on legal analysis, legal developments, and jurisprudence.',
        category: 'research',
      },
      {
        term: 'All Nigeria Law Reports (All NLR)',
        definition: 'A series of law reports that contain selected judgments of Nigerian courts. Citations to All NLR include the year, volume, and page number.',
        category: 'citation',
      },
    ];
    
    sampleTerms.forEach(term => this.createGlossaryTerm(term));
    
    // Sample FAQ items
    const sampleFaqs: InsertFaqItem[] = [
      {
        question: 'What is the NALT Citation Guide?',
        answer: 'The NALT Citation Guide is the official standard published by the Nigerian Association of Law Teachers for formatting legal citations in academic writing, research papers, and publications in Nigeria. It provides comprehensive rules for citing various legal sources including cases, statutes, books, journal articles, and other materials relevant to Nigerian legal scholarship.',
        order: 1,
      },
      {
        question: 'How does NALT citation differ from OSCOLA?',
        answer: 'While NALT citation format shares some similarities with the Oxford Standard for Citation of Legal Authorities (OSCOLA), it has been specifically adapted for the Nigerian legal system. Key differences include specialized rules for citing Nigerian cases, statutes, and legal materials, as well as variations in punctuation, abbreviation conventions, and formatting requirements tailored to Nigerian legal scholarship practices.',
        order: 2,
      },
      {
        question: 'How do I cite Nigerian court cases?',
        answer: 'Nigerian court cases should be cited following this format: <i>Case Name</i> [Year] Volume Law Report Abbreviation Starting Page. For example: <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550. If citing a specific page, add the page number after the starting page, e.g., <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550, 575.',
        order: 3,
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
    
    if (category && category !== 'all') {
      terms = terms.filter(term => term.category === category);
    }
    
    return terms;
  }
  
  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    return this.glossaryTerms.get(id);
  }
  
  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const id = this.nextId.glossaryTerms++;
    const glossaryTerm: GlossaryTerm = { ...term, id };
    this.glossaryTerms.set(id, glossaryTerm);
    return glossaryTerm;
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
  
  // FAQ methods
  async getFaqItems(): Promise<FaqItem[]> {
    return Array.from(this.faqItems.values()).sort((a, b) => a.order - b.order);
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    return this.faqItems.get(id);
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const id = this.nextId.faqItems++;
    const faqItem: FaqItem = { ...item, id };
    this.faqItems.set(id, faqItem);
    return faqItem;
  }
}

export const storage = new MemStorage();
