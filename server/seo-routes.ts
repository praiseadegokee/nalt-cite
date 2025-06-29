import { Request, Response } from 'express';
import { dbStorage } from './dbStorage';

// Generate dynamic sitemap.xml with all pages and blog posts
export async function generateSitemap(req: Request, res: Response) {
  try {
    const baseUrl = req.get('host')?.includes('localhost') ? 
      `http://${req.get('host')}` : 
      `https://${req.get('host')}`;

    // Get all blog posts for dynamic sitemap
    const blogPosts = await dbStorage.getBlogPosts();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/citation-generator</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/chat</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/glossary</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/resources</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;

    // Add blog posts to sitemap
    blogPosts.forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}

// Generate robots.txt dynamically
export function generateRobotsTxt(req: Request, res: Response) {
  const baseUrl = req.get('host')?.includes('localhost') ? 
    `http://${req.get('host')}` : 
    `https://${req.get('host')}`;

  const robotsTxt = `User-agent: *
Allow: /

# Important pages for indexing
Allow: /citation-generator
Allow: /chat
Allow: /glossary
Allow: /faq
Allow: /blog
Allow: /resources

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for better server performance
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
}

// JSON-LD structured data for the organization
export function generateStructuredData(req: Request, res: Response) {
  const baseUrl = req.get('host')?.includes('localhost') ? 
    `http://${req.get('host')}` : 
    `https://${req.get('host')}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "NALT Cite",
        "alternateName": "Nigerian Association of Law Teachers Citation Tool",
        "url": baseUrl,
        "description": "Professional legal citation generator for Nigerian law following NALT format standards",
        "foundingDate": "2025",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "support",
          "availableLanguage": "English"
        },
        "areaServed": "Nigeria",
        "serviceType": "Legal Citation Services"
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "NALT Cite",
        "description": "Professional legal citation generator for Nigerian law",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/glossary?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        "name": "NALT Citation Generator",
        "url": `${baseUrl}/citation-generator`,
        "description": "Generate professional NALT format citations for Nigerian legal documents",
        "applicationCategory": "LegalApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "NGN"
        },
        "featureList": [
          "Legal citation generation",
          "NALT format compliance",
          "AI-powered assistance",
          "Multiple source types support",
          "Legal glossary",
          "Citation validation"
        ]
      }
    ]
  };

  res.json(structuredData);
}