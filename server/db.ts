import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { z } from 'zod';

import { 
  users, type User, type InsertUser,
  citationSources, type CitationSource, type InsertCitationSource,
  glossaryTerms, type GlossaryTerm, type InsertGlossaryTerm,
  blogPosts, type BlogPost, type InsertBlogPost,
  resources, type Resource, type InsertResource,
  faqItems, type FaqItem, type InsertFaqItem
} from "@shared/schema";

// Environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a SQL client with Neon
const sql = neon(databaseUrl);

// Create a Drizzle client
export const db = drizzle(sql);

// Initialize the database
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    console.log('Initializing database tables...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create citation_sources table
    await sql`
      CREATE TABLE IF NOT EXISTS citation_sources (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        default_format TEXT
      );
    `;

    // Create glossary_terms table
    await sql`
      CREATE TABLE IF NOT EXISTS glossary_terms (
        id SERIAL PRIMARY KEY,
        term TEXT NOT NULL,
        definition TEXT NOT NULL,
        category TEXT
      );
    `;

    // Create blog_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        author TEXT NOT NULL,
        read_time INTEGER NOT NULL,
        category TEXT NOT NULL,
        tags TEXT
      );
    `;

    // Create resources table
    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        size TEXT
      );
    `;

    // Create faq_items table
    await sql`
      CREATE TABLE IF NOT EXISTS faq_items (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        order_num INTEGER NOT NULL
      );
    `;

    console.log('Database tables initialized successfully.');
    
    // Check if the glossary_terms table is empty and add sample data if needed
    const glossaryCount = await sql`SELECT COUNT(*) FROM glossary_terms`;
    if (glossaryCount[0].count === '0') {
      console.log('Adding sample glossary terms...');
      
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
      
      for (const term of sampleTerms) {
        await sql`
          INSERT INTO glossary_terms (term, definition, category)
          VALUES (${term.term}, ${term.definition}, NULL)
        `;
      }
      
      console.log('Sample glossary terms added successfully.');
    }

    // Check if the faq_items table is empty and add sample data if needed
    const faqCount = await sql`SELECT COUNT(*) FROM faq_items`;
    if (faqCount[0].count === '0') {
      console.log('Adding sample FAQ items...');
      
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
      
      for (const faq of sampleFaqs) {
        await sql`
          INSERT INTO faq_items (question, answer, order_num)
          VALUES (${faq.question}, ${faq.answer}, ${faq.order})
        `;
      }
      
      console.log('Sample FAQ items added successfully.');
    }

    // Check if the blog_posts table is empty and add sample data if needed
    const blogCount = await sql`SELECT COUNT(*) FROM blog_posts`;
    if (blogCount[0].count === '0') {
      console.log('Adding sample blog posts...');
      
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
      
      for (const post of sampleBlogPosts) {
        await sql`
          INSERT INTO blog_posts (title, excerpt, content, date, author, read_time, category, tags)
          VALUES (
            ${post.title}, 
            ${post.excerpt}, 
            ${post.content}, 
            ${post.date}, 
            ${post.author}, 
            ${post.readTime}, 
            ${post.category}, 
            ${post.tags}
          )
        `;
      }
      
      console.log('Sample blog posts added successfully.');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}