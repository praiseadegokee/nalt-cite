/**
 * Seed the Neon PostgreSQL database with all data from seed-data.json
 * Run with: npx tsx scripts/seed-db.ts
 */

import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      if (!process.env[key.trim()]) process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set'); process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const seedPath = path.resolve(process.cwd(), 'server/seed-data.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// seed-data.json structure: { glossary, faqCategories, faqItems, blogs }

async function main() {
  console.log('🌱 Starting database seed...\n');

  // --- Glossary Terms ---
  const existingGlossary = await db.select({ id: schema.glossaryTerms.id }).from(schema.glossaryTerms);
  if (existingGlossary.length === 0) {
    console.log(`📚 Seeding ${seed.glossary.length} glossary terms...`);
    for (const term of seed.glossary) {
      await db.insert(schema.glossaryTerms).values({
        term: term.term,
        definition: term.definition,
        category: term.category || '',
      });
    }
    console.log(`   ✅ Done`);
  } else {
    console.log(`📚 Glossary: ⏭️  ${existingGlossary.length} terms already exist`);
  }

  // --- FAQ Categories ---
  const existingFaqCats = await db.select({ id: schema.faqCategories.id }).from(schema.faqCategories);
  if (existingFaqCats.length === 0) {
    console.log(`\n❓ Seeding ${seed.faqCategories.length} FAQ categories...`);
    // Insert in order — the faqItems already have correct categoryId (1-based)
    for (const cat of seed.faqCategories) {
      await db.insert(schema.faqCategories).values({
        name: cat.name,
        description: cat.description || null,
        order: cat.order || 0,
      });
    }
    console.log(`   ✅ Done`);
  } else {
    console.log(`\n❓ FAQ Categories: ⏭️  ${existingFaqCats.length} already exist`);
  }

  // --- FAQ Items ---
  const existingFaqItems = await db.select({ id: schema.faqItems.id }).from(schema.faqItems);
  if (existingFaqItems.length === 0) {
    console.log(`\n❓ Seeding ${seed.faqItems.length} FAQ items...`);
    for (const item of seed.faqItems) {
      await db.insert(schema.faqItems).values({
        question: item.question,
        answer: item.answer,
        categoryId: item.categoryId,
        order: item.order || 0,
      });
    }
    console.log(`   ✅ Done`);
  } else {
    console.log(`\n❓ FAQ Items: ⏭️  ${existingFaqItems.length} already exist`);
  }

  // --- Blog Posts ---
  const existingBlogs = await db.select({ id: schema.blogPosts.id }).from(schema.blogPosts);
  if (existingBlogs.length === 0) {
    console.log(`\n📰 Seeding ${seed.blogs.length} blog posts...`);
    for (const post of seed.blogs) {
      const tags = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
      await db.insert(schema.blogPosts).values({
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 200).trim() + '...',
        content: post.content,
        date: post.date || new Date().toISOString().split('T')[0],
        author: post.author || 'NALT Editorial Team',
        readTime: post.readTime || Math.max(1, Math.round((post.content || '').split(/\s+/).length / 200)),
        category: post.category || 'General',
        tags,
        thumbnail: post.thumbnail || post.thumbnailUrl || null,
      });
    }
    console.log(`   ✅ Done`);
  } else {
    console.log(`\n📰 Blog: ⏭️  ${existingBlogs.length} posts already exist`);
  }

  console.log('\n🎉 Seed complete!');
  await pool.end();
}

main().catch(err => {
  console.error('❌ Seed failed:', err.message || err);
  pool.end();
  process.exit(1);
});
