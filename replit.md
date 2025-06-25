# NALT Cite - Legal Citation Assistant

## Overview

NALT Cite is a comprehensive web application designed to assist with legal citation formatting according to the Nigerian Association of Law Teachers (NALT) Uniform Format and Citation Guide. The application provides citation generation tools, AI-powered assistance, educational resources, and administrative capabilities for managing legal citation requirements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and React Context for local state
- **UI Framework**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **File Handling**: Multer for file uploads with local storage

### AI Integration
- **AI Provider**: Google Gemini AI (Generative AI)
- **RAG System**: Custom implementation for document-based question answering
- **Document Processing**: PDF parsing with chunking for vector search
- **Chat Interface**: Real-time conversation management with persistent storage

## Key Components

### Citation Generator
- Multi-source citation support (cases, statutes, books, journal articles, etc.)
- Real-time validation and formatting
- Export capabilities (plain text, formatted)
- NALT standard compliance

### AI Chat Assistant
- Intelligent citation generation - automatically detects when users want to cite sources and generates properly formatted NALT citations
- Document-based question answering using uploaded NALT and OSCOLA guides
- Conversation persistence with session management
- Multiple conversation support
- Document upload and processing capabilities
- Advanced citation parsing for cases, statutes, journal articles, books, and other legal sources

### Content Management
- **Glossary**: Searchable legal terminology database with CRUD operations
- **Blog**: Article publishing system with categories and tagging
- **FAQ**: Categorized question-answer system
- **Resources**: File management for PDFs and documents

### Administrative Interface
- Blog post management with thumbnail uploads
- Glossary term administration
- FAQ category and item management
- File upload interface for resources

## Data Flow

### Citation Generation Flow
1. User selects citation type and fills form
2. Client-side validation using Zod schemas
3. Citation formatting using factory pattern
4. Real-time preview and export options

### AI Chat Flow
1. User submits question or uploads document
2. Document processing (PDF parsing and chunking)
3. Vector search against processed documents
4. AI response generation using Gemini API
5. Conversation persistence in PostgreSQL

### Content Management Flow
1. Admin creates/edits content through forms
2. Data validation and sanitization
3. Database storage with Drizzle ORM
4. Real-time updates via TanStack Query

## External Dependencies

### Core Dependencies
- **@google/generative-ai**: AI chat functionality
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **pdf-parse**: PDF document processing
- **multer**: File upload handling

### Development Dependencies
- **vite**: Build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety
- **tsx**: TypeScript execution

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Built static files served by Express
- **Database**: Neon PostgreSQL with connection pooling
- **File Storage**: Local filesystem for uploaded files

### Build Process
1. Frontend build using Vite (outputs to `dist/public`)
2. Backend build using esbuild (outputs to `dist`)
3. Static file serving through Express in production

### Deployment Targets
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Environment Variables**: DATABASE_URL and GEMINI_API_KEY required

## Changelog

```
Changelog:
- June 25, 2025. Enhanced AI chatbot with intelligent citation generation - now automatically detects citation requests and formats sources according to NALT standards
- June 25, 2025. Fixed AI chatbot mobile responsiveness and overflow issues, improved session management
- June 25, 2025. Fixed NALT guide download functionality - mapped file IDs to actual PDF filenames  
- June 24, 2025. Enhanced blog UI/UX with modern responsive design, search, and filtering
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```