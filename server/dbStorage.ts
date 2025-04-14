import { db, initializeDatabase } from './db';
import { neon } from '@neondatabase/serverless';
import { 
  users, type User, type InsertUser,
  citationSources, type CitationSource, type InsertCitationSource,
  glossaryTerms, type GlossaryTerm, type InsertGlossaryTerm,
  blogPosts, type BlogPost, type InsertBlogPost,
  resources, type Resource, type InsertResource,
  faqItems, type FaqItem, type InsertFaqItem
} from "@shared/schema";
import { IStorage } from './storage';

// Get SQL client for direct queries
const sql = neon(process.env.DATABASE_URL!);

export class DbStorage implements IStorage {
  // Initialize database connection
  constructor() {
    // Database initialization happens when the server starts
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.execute(sql`SELECT * FROM users WHERE id = ${id}`);
    return result[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.execute(sql`SELECT * FROM users WHERE username = ${username}`);
    return result[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.execute(sql`
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES (${user.username}, ${user.email || null}, ${user.passwordHash}, CURRENT_TIMESTAMP)
      RETURNING *
    `);
    return result[0] as User;
  }
  
  // Citation source methods
  async getCitationSources(): Promise<CitationSource[]> {
    const result = await db.execute(sql`SELECT * FROM citation_sources`);
    return result as CitationSource[];
  }
  
  async getCitationSource(id: number): Promise<CitationSource | undefined> {
    const result = await db.execute(sql`SELECT * FROM citation_sources WHERE id = ${id}`);
    return result[0] as CitationSource | undefined;
  }
  
  async createCitationSource(source: InsertCitationSource): Promise<CitationSource> {
    const result = await db.execute(sql`
      INSERT INTO citation_sources (name, description, type, default_format)
      VALUES (${source.name}, ${source.description || null}, ${source.type}, ${source.defaultFormat || null})
      RETURNING *
    `);
    return result[0] as CitationSource;
  }
  
  // Glossary term methods
  async getGlossaryTerms(letter?: string, category?: string): Promise<GlossaryTerm[]> {
    let query = sql`SELECT * FROM glossary_terms`;
    
    if (letter) {
      // Filter by first letter (case insensitive)
      query = sql`SELECT * FROM glossary_terms WHERE UPPER(SUBSTRING(term, 1, 1)) = UPPER(${letter})`;
    }
    
    // We're no longer using category filtering but kept for compatibility
    
    const result = await db.execute(query);
    return result as GlossaryTerm[];
  }
  
  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    const result = await db.execute(sql`SELECT * FROM glossary_terms WHERE id = ${id}`);
    return result[0] as GlossaryTerm | undefined;
  }
  
  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const result = await db.execute(sql`
      INSERT INTO glossary_terms (term, definition, category)
      VALUES (${term.term}, ${term.definition}, NULL)
      RETURNING *
    `);
    return result[0] as GlossaryTerm;
  }
  
  async updateGlossaryTerm(id: number, term: InsertGlossaryTerm): Promise<GlossaryTerm | undefined> {
    // First check if the term exists
    const exists = await this.getGlossaryTerm(id);
    if (!exists) {
      return undefined;
    }
    
    // Update the term
    const result = await db.execute(sql`
      UPDATE glossary_terms 
      SET term = ${term.term}, definition = ${term.definition}
      WHERE id = ${id}
      RETURNING *
    `);
    
    return result[0] as GlossaryTerm | undefined;
  }
  
  async deleteGlossaryTerm(id: number): Promise<boolean> {
    // First check if the term exists
    const exists = await this.getGlossaryTerm(id);
    if (!exists) {
      return false;
    }
    
    // Delete the term
    await db.execute(sql`DELETE FROM glossary_terms WHERE id = ${id}`);
    return true;
  }
  
  async searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
    if (!query) {
      return this.getGlossaryTerms();
    }
    
    const result = await db.execute(sql`
      SELECT * FROM glossary_terms 
      WHERE term ILIKE ${'%' + query + '%'} OR definition ILIKE ${'%' + query + '%'}
    `);
    
    return result as GlossaryTerm[];
  }
  
  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    const result = await db.execute(sql`SELECT * FROM blog_posts ORDER BY date DESC`);
    return result as BlogPost[];
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.execute(sql`SELECT * FROM blog_posts WHERE id = ${id}`);
    return result[0] as BlogPost | undefined;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.execute(sql`
      INSERT INTO blog_posts (title, excerpt, content, date, author, read_time, category, tags)
      VALUES (${post.title}, ${post.excerpt}, ${post.content}, ${post.date}, 
              ${post.author}, ${post.readTime}, ${post.category}, ${post.tags || null})
      RETURNING *
    `);
    return result[0] as BlogPost;
  }
  
  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    let query = sql`SELECT * FROM resources`;
    
    if (category && category !== 'all') {
      query = sql`SELECT * FROM resources WHERE category = ${category}`;
    }
    
    const result = await db.execute(query);
    return result as Resource[];
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    const result = await db.execute(sql`SELECT * FROM resources WHERE id = ${id}`);
    return result[0] as Resource | undefined;
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await db.execute(sql`
      INSERT INTO resources (title, description, link, type, category, size)
      VALUES (${resource.title}, ${resource.description}, ${resource.link}, 
              ${resource.type}, ${resource.category}, ${resource.size || null})
      RETURNING *
    `);
    return result[0] as Resource;
  }
  
  // FAQ methods
  async getFaqItems(): Promise<FaqItem[]> {
    const result = await db.execute(sql`SELECT * FROM faq_items ORDER BY order_num ASC`);
    return result as FaqItem[];
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    const result = await db.execute(sql`SELECT * FROM faq_items WHERE id = ${id}`);
    return result[0] as FaqItem | undefined;
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const result = await db.execute(sql`
      INSERT INTO faq_items (question, answer, order_num)
      VALUES (${item.question}, ${item.answer}, ${item.order})
      RETURNING *
    `);
    return result[0] as FaqItem;
  }
}

// Export a singleton instance of the DbStorage
export const dbStorage = new DbStorage();