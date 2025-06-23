import { pgTable, text, serial, integer, timestamp, vector } from "drizzle-orm/pg-core";
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

// FAQ categories table
export const faqCategories = pgTable("faq_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  order: integer("order_num").notNull().default(0),
});

// FAQ items table
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  categoryId: integer("category_id").notNull().default(1),
  order: integer("order_num").notNull().default(0),
});

// Documents table for RAG system
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  documentType: text("document_type").notNull(), // 'nalt' or 'oscola'
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Document chunks table for RAG retrieval
export const documentChunks = pgTable("document_chunks", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  content: text("content").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  embedding: text("embedding"), // Store as JSON string since we don't have vector support
});

// Chat conversations table
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  sources: text("sources"), // JSON array of source document references
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const insertFaqCategorySchema = createInsertSchema(faqCategories).pick({
  name: true,
  description: true,
  order: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).pick({
  question: true,
  answer: true,
  categoryId: true,
  order: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  filename: true,
  title: true,
  content: true,
  documentType: true,
});

export const insertDocumentChunkSchema = createInsertSchema(documentChunks).pick({
  documentId: true,
  content: true,
  chunkIndex: true,
  embedding: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  sessionId: true,
  title: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  conversationId: true,
  role: true,
  content: true,
  sources: true,
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

export type InsertFaqCategory = z.infer<typeof insertFaqCategorySchema>;
export type FaqCategory = typeof faqCategories.$inferSelect;

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentChunk = z.infer<typeof insertDocumentChunkSchema>;
export type DocumentChunk = typeof documentChunks.$inferSelect;

export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
