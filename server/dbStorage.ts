import { neon } from '@neondatabase/serverless';
import { 
  type User, type InsertUser,
  type CitationSource, type InsertCitationSource,
  type GlossaryTerm, type InsertGlossaryTerm,
  type BlogPost, type InsertBlogPost,
  type Resource, type InsertResource,
  type FaqItem, type InsertFaqItem
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
  
  // FAQ methods
  async getFaqItems(): Promise<FaqItem[]> {
    const items = await sqlClient`SELECT * FROM faq_items ORDER BY order_num ASC`;
    return items as FaqItem[];
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    const items = await sqlClient`SELECT * FROM faq_items WHERE id = ${id}`;
    return items[0] as FaqItem | undefined;
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const result = await sqlClient`
      INSERT INTO faq_items (question, answer, order_num)
      VALUES (${item.question}, ${item.answer}, ${item.order})
      RETURNING *
    `;
    return result[0] as FaqItem;
  }
}

// Export a singleton instance of the DbStorage
export const dbStorage = new DbStorage();