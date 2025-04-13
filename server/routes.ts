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
    try {
      const file = req.params.file;
      
      // Define valid locations to look for files
      const possibleLocations = [
        // Try exact filename as provided
        path.resolve(process.cwd(), 'public/pdfs', file),
        // Try with .pdf extension
        path.resolve(process.cwd(), 'public/pdfs', `${file}.pdf`),
        // Try in other potential directories
        path.resolve(process.cwd(), 'public/downloads', file),
        path.resolve(process.cwd(), 'public/downloads', `${file}.pdf`)
      ];
      
      // Find the first existing file
      const filePath = possibleLocations.find(location => fs.existsSync(location));
      
      // Handle file not found
      if (!filePath) {
        console.log(`File not found: ${file}`);
        return res.status(404).json({ 
          message: "File not found",
          requestedFile: file,
          checkedLocations: possibleLocations.map(p => path.relative(process.cwd(), p))
        });
      }
      
      // Extract the original filename for the download
      const filename = path.basename(filePath);
      
      // Determine content type based on extension
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream'; // Default
      
      // Set proper content type
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      // Set headers and send file
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
      
      console.log(`File successfully sent: ${filename}`);
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ message: "Error serving file" });
    }
  });

  // File upload endpoint with improved error handling
  const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      // Determine destination based on file type
      let uploadDir;
      
      if (file.mimetype === 'application/pdf') {
        uploadDir = path.resolve(process.cwd(), 'public/pdfs');
      } else {
        // For other document types
        uploadDir = path.resolve(process.cwd(), 'public/downloads');
      }
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      // Keep original filename
      cb(null, file.originalname);
    }
  });

  const upload = multer({ 
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
      // Allow PDF, Word docs, and Excel spreadsheets
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
      ];
      
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only PDF, DOCX, and XLSX files are allowed'));
      }
    },
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
  });

  app.post(`${apiPrefix}/upload`, upload.single('file'), (req: Request, res: Response) => {
    try {
      // Handle missing file or validation errors
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded or invalid file type',
          allowedTypes: ['PDF', 'DOCX', 'XLSX'],
          maxSize: '50MB'
        });
      }
      
      // Log successful upload
      console.log(`File uploaded successfully: ${req.file.originalname} (${req.file.size} bytes)`);
      
      // Return success response with details
      res.status(200).json({ 
        success: true,
        message: 'File uploaded successfully',
        file: {
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          destination: path.relative(process.cwd(), req.file.destination)
        }
      });
    } catch (error) {
      // Log and return error details
      console.error('Error uploading file:', error);
      res.status(500).json({ 
        success: false,
        message: 'File upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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
