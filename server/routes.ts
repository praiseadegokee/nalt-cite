import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dbStorage } from "./dbStorage";

// Use database storage instead of memory storage
const activeStorage = dbStorage;
import path from "path";
import fs from "fs";
import multer from "multer";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";
  
  // Serve cover image directly - will use the first image found in the pdfs directory
  app.get('/cover-image', (req: Request, res: Response) => {
    const pdfsDir = path.resolve(process.cwd(), 'public/pdfs');
    
    try {
      // Get all files in the pdfs directory
      const files = fs.readdirSync(pdfsDir);
      
      // Find the first image file (jpg, jpeg, png, gif, webp)
      const imageFile = files.find(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      
      if (imageFile) {
        const imagePath = path.join(pdfsDir, imageFile);
        console.log(`Serving cover image: ${imageFile}`);
        
        // Set content type based on extension
        const ext = path.extname(imageFile).toLowerCase();
        let contentType = 'image/png'; // Default
        
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
        
        res.setHeader('Content-Type', contentType);
        res.sendFile(imagePath);
      } else {
        res.status(404).send('No image found in pdfs directory');
      }
    } catch (error) {
      console.error('Error serving cover image:', error);
      res.status(500).send('Error finding cover image');
    }
  });
  
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
        terms = await activeStorage.searchGlossaryTerms(query as string);
      } else {
        terms = await activeStorage.getGlossaryTerms(letter as string, category as string);
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
      const term = await activeStorage.getGlossaryTerm(id);
      if (!term) {
        return res.status(404).json({ message: "Glossary term not found" });
      }
      res.json(term);
    } catch (error) {
      console.error(`Error fetching glossary term ${id}:`, error);
      res.status(500).json({ message: "Failed to fetch glossary term" });
    }
  });
  
  app.post(`${apiPrefix}/glossary`, async (req: Request, res: Response) => {
    try {
      const { term, definition } = req.body;
      
      // Basic validation
      if (!term || !definition) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            term: !term ? "Term is required" : null,
            definition: !definition ? "Definition is required" : null
          }
        });
      }
      
      // Create the new glossary term
      const newTerm = await activeStorage.createGlossaryTerm({
        term,
        definition
      });
      
      res.status(201).json(newTerm);
    } catch (error) {
      console.error("Error creating glossary term:", error);
      res.status(500).json({ message: "Failed to create glossary term" });
    }
  });
  
  // Update glossary term
  app.put(`${apiPrefix}/glossary/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const { term, definition } = req.body;
      
      // Basic validation
      if (!term || !definition) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            term: !term ? "Term is required" : null,
            definition: !definition ? "Definition is required" : null
          }
        });
      }
      
      // Update the glossary term
      const updatedTerm = await activeStorage.updateGlossaryTerm(id, {
        term,
        definition
      });
      
      if (!updatedTerm) {
        return res.status(404).json({ message: "Glossary term not found" });
      }
      
      res.json(updatedTerm);
    } catch (error) {
      console.error(`Error updating glossary term ${id}:`, error);
      res.status(500).json({ message: "Failed to update glossary term" });
    }
  });
  
  // Delete glossary term
  app.delete(`${apiPrefix}/glossary/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const result = await activeStorage.deleteGlossaryTerm(id);
      
      if (!result) {
        return res.status(404).json({ message: "Glossary term not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting glossary term ${id}:`, error);
      res.status(500).json({ message: "Failed to delete glossary term" });
    }
  });

  // FAQ Category API endpoints
  app.get(`${apiPrefix}/faq/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await activeStorage.getFaqCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      res.status(500).json({ message: "Failed to fetch FAQ categories" });
    }
  });
  
  app.get(`${apiPrefix}/faq/categories/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const category = await activeStorage.getFaqCategory(id);
      if (!category) {
        return res.status(404).json({ message: "FAQ category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error(`Error fetching FAQ category ${id}:`, error);
      res.status(500).json({ message: "Failed to fetch FAQ category" });
    }
  });
  
  app.post(`${apiPrefix}/faq/categories`, async (req: Request, res: Response) => {
    try {
      const { name, description, order } = req.body;
      
      // Basic validation
      if (!name) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            name: !name ? "Name is required" : null
          }
        });
      }
      
      // Create the new FAQ category
      const newCategory = await activeStorage.createFaqCategory({
        name,
        description,
        order: order || 0
      });
      
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating FAQ category:", error);
      res.status(500).json({ message: "Failed to create FAQ category" });
    }
  });
  
  app.put(`${apiPrefix}/faq/categories/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const { name, description, order } = req.body;
      
      // Basic validation
      if (!name) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            name: !name ? "Name is required" : null
          }
        });
      }
      
      // Update the FAQ category
      const updatedCategory = await activeStorage.updateFaqCategory(id, {
        name,
        description,
        order: order || 0
      });
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "FAQ category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      console.error(`Error updating FAQ category ${id}:`, error);
      res.status(500).json({ message: "Failed to update FAQ category" });
    }
  });
  
  app.delete(`${apiPrefix}/faq/categories/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const result = await activeStorage.deleteFaqCategory(id);
      
      if (!result) {
        return res.status(404).json({ 
          message: "FAQ category not found or cannot be deleted because it has associated FAQ items" 
        });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting FAQ category ${id}:`, error);
      res.status(500).json({ message: "Failed to delete FAQ category" });
    }
  });
  
  // FAQ Item API endpoints
  app.get(`${apiPrefix}/faq/items`, async (req: Request, res: Response) => {
    const { categoryId } = req.query;
    
    try {
      const faqItems = await activeStorage.getFaqItems(
        categoryId ? parseInt(categoryId as string) : undefined
      );
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });
  
  app.get(`${apiPrefix}/faq/items/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const item = await activeStorage.getFaqItem(id);
      if (!item) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error(`Error fetching FAQ item ${id}:`, error);
      res.status(500).json({ message: "Failed to fetch FAQ item" });
    }
  });
  
  app.post(`${apiPrefix}/faq/items`, async (req: Request, res: Response) => {
    try {
      const { question, answer, categoryId, order } = req.body;
      
      // Basic validation
      if (!question || !answer || !categoryId) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            question: !question ? "Question is required" : null,
            answer: !answer ? "Answer is required" : null,
            categoryId: !categoryId ? "Category ID is required" : null
          }
        });
      }
      
      // Create the new FAQ item
      const newItem = await activeStorage.createFaqItem({
        question,
        answer,
        categoryId,
        order: order || 0
      });
      
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating FAQ item:", error);
      res.status(500).json({ message: "Failed to create FAQ item" });
    }
  });
  
  app.put(`${apiPrefix}/faq/items/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      // Log the request body for debugging
      console.log("Update FAQ item request body:", JSON.stringify(req.body));
      
      // Extract values, considering both field naming conventions
      // The database has order_num and category_id, but we use order and categoryId in the frontend
      const question = req.body.question;
      const answer = req.body.answer;
      const categoryId = req.body.categoryId || req.body.category_id;
      const order = req.body.order || req.body.order_num || 0;
      
      // Log the extracted values
      console.log("Extracted values:", { question, answer, categoryId, order });
      
      // Basic validation
      if (!question || !answer || !categoryId) {
        console.log("Validation failed:", { 
          hasQuestion: !!question, 
          hasAnswer: !!answer, 
          hasCategoryId: !!categoryId 
        });
        
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            question: !question ? "Question is required" : null,
            answer: !answer ? "Answer is required" : null,
            categoryId: !categoryId ? "Category ID is required" : null
          }
        });
      }
      
      // Update the FAQ item
      const updatedItem = await activeStorage.updateFaqItem(id, {
        question,
        answer,
        categoryId,
        order: order || 0
      });
      
      if (!updatedItem) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error updating FAQ item ${id}:`, error);
      res.status(500).json({ message: "Failed to update FAQ item" });
    }
  });
  
  app.delete(`${apiPrefix}/faq/items/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const result = await activeStorage.deleteFaqItem(id);
      
      if (!result) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting FAQ item ${id}:`, error);
      res.status(500).json({ message: "Failed to delete FAQ item" });
    }
  });
  
  // For backward compatibility, maintain the old endpoint
  app.get(`${apiPrefix}/faq`, async (req: Request, res: Response) => {
    try {
      const faqItems = await activeStorage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  // Blog API endpoints
  app.get(`${apiPrefix}/blog/posts`, async (req: Request, res: Response) => {
    try {
      const posts = await activeStorage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post(`${apiPrefix}/blog/posts`, async (req: Request, res: Response) => {
    try {
      const { title, excerpt, content, date, author, readTime, category, tags } = req.body;
      
      // Create the blog post
      const newPost = await activeStorage.createBlogPost({
        title,
        excerpt,
        content,
        date,
        author,
        readTime,
        category,
        tags
      });
      
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ 
        message: "Failed to create blog post",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get(`${apiPrefix}/blog/posts/:id`, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    try {
      const post = await activeStorage.getBlogPost(id);
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
      const resources = await activeStorage.getResources(category as string);
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
      
      // Image files and PDFs go to the pdfs directory, other files to downloads
      if (file.mimetype === 'application/pdf' || 
          file.mimetype.startsWith('image/')) {
        uploadDir = path.resolve(process.cwd(), 'public/pdfs');
      } else {
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
      // Allow PDF, Word docs, Excel spreadsheets, and common image formats
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'image/jpeg',  // .jpg, .jpeg
        'image/png',   // .png
        'image/gif',   // .gif
        'image/webp'   // .webp
      ];
      
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only PDF, DOCX, XLSX, and image files (JPG, PNG, GIF, WEBP) are allowed'));
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
          allowedTypes: ['PDF', 'DOCX', 'XLSX', 'JPG/JPEG', 'PNG', 'GIF', 'WEBP'],
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
