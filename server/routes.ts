import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";
  
  // Health check endpoint
  app.get(`${apiPrefix}/health`, (req: Request, res: Response) => {
    res.json({ status: "ok", message: "NALT Cite API is running" });
  });

  // Glossary API endpoints
  app.get(`${apiPrefix}/glossary`, async (req: Request, res: Response) => {
    const { letter, category, query } = req.query;
    
    try {
      let terms;
      if (query) {
        terms = await storage.searchGlossaryTerms(query as string);
      } else {
        terms = await storage.getGlossaryTerms(letter as string, category as string);
      }
      res.json(terms);
    } catch (error) {
      console.error("Error fetching glossary terms:", error);
      res.status(500).json({ message: "Failed to fetch glossary terms" });
    }
  });

  app.get(`${apiPrefix}/glossary/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const term = await storage.getGlossaryTerm(id);
      if (!term) {
        return res.status(404).json({ message: "Glossary term not found" });
      }
      res.json(term);
    } catch (error) {
      console.error(`Error fetching glossary term ${id}:`, error);
      res.status(500).json({ message: "Failed to fetch glossary term" });
    }
  });

  // FAQ API endpoints
  app.get(`${apiPrefix}/faq`, async (req: Request, res: Response) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  // Blog API endpoints
  app.get(`${apiPrefix}/blog/posts`, async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get(`${apiPrefix}/blog/posts/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Resources API endpoints
  app.get(`${apiPrefix}/resources`, async (req: Request, res: Response) => {
    const { category } = req.query;
    
    try {
      const resources = await storage.getResources(category as string);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // PDF file download endpoints
  app.get(`${apiPrefix}/downloads/:file`, (req: Request, res: Response) => {
    const file = req.params.file;
    const filePath = path.resolve(process.cwd(), 'public/pdfs', `${file}.pdf`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Set headers and send file
    res.setHeader('Content-Disposition', `attachment; filename="${file}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  });

  // File Upload handling
  // Setup multer storage
  const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const targetDir = path.resolve(process.cwd(), 'public/pdfs');
      // Create directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      cb(null, targetDir);
    },
    filename: function (req, file, cb) {
      // Use the original filename if it's a PDF, or convert it
      const fileExt = path.extname(file.originalname).toLowerCase();
      if (fileExt !== '.pdf') {
        return cb(new Error('Only PDF files are allowed'), '');
      }
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ 
    storage: pdfStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'));
      }
      cb(null, true);
    }
  });
  
  // File upload endpoint
  app.post(`${apiPrefix}/upload-pdf`, upload.single('pdfFile'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      res.json({ 
        message: 'File uploaded successfully', 
        filename: req.file.filename 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });

  // Citation generator API endpoint
  app.post(`${apiPrefix}/generate-citation`, (req: Request, res: Response) => {
    const { sourceType, author, title, edition, publisher, year, page } = req.body;
    
    // Simple citation formatter - in a real app this would be more sophisticated
    // and would handle different source types differently
    let formattedCitation = "";
    
    // Format based on source type
    if (sourceType === "book") {
      formattedCitation = `${author}, <i>${title}</i>`;
      
      if (edition) {
        formattedCitation += ` (${edition}, ${publisher} ${year})`;
      } else {
        formattedCitation += ` (${publisher} ${year})`;
      }
      
      if (page) {
        formattedCitation += ` ${page}`;
      }
    } else if (sourceType === "journalArticle") {
      formattedCitation = `${author}, '${title}' (${year}) ${publisher}`;
      
      if (page) {
        formattedCitation += ` ${page}`;
      }
    } else if (sourceType === "case") {
      formattedCitation = `<i>${title}</i> [${year}] ${publisher} ${page || ""}`;
    } else {
      // Basic format for other types
      formattedCitation = `${author}, <i>${title}</i> (${publisher} ${year})`;
      
      if (page) {
        formattedCitation += ` ${page}`;
      }
    }
    
    res.json({ citation: formattedCitation });
  });

  const httpServer = createServer(app);

  return httpServer;
}
