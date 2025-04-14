import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Citation sources table
export const citationSources = pgTable("citation_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultFormat: text("default_format"),
});

// Glossary terms table
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  // Category field is kept in database schema for backward compatibility
  // but no longer used in the application
  category: text("category").default(''),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  readTime: integer("read_time").notNull(),
  category: text("category").notNull(),
  tags: text("tags"),
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  size: text("size"),
  downloadUrl: text("download_url").notNull(),
  category: text("category").notNull(),
});

// FAQ items table
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCitationSourceSchema = createInsertSchema(citationSources).pick({
  name: true,
  description: true,
  defaultFormat: true,
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).pick({
  term: true,
  definition: true,
  // category removed from insert schema
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  excerpt: true,
  content: true,
  date: true,
  author: true,
  readTime: true,
  category: true,
  tags: true,
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  type: true,
  size: true,
  downloadUrl: true,
  category: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).pick({
  question: true,
  answer: true,
  order: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCitationSource = z.infer<typeof insertCitationSourceSchema>;
export type CitationSource = typeof citationSources.$inferSelect;

export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;
