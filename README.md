# NALT Cite - PDF Management Guide

## Overview

This document explains how to manage PDF files for the NALT Citation application, specifically for the NALT Uniform Format and Citation Guide documents.

## File Structure

PDF files are stored in the `public/pdfs/` directory. When uploaded, they are accessible through the application's download interface on the Resources page.

## PDF Upload Methods

There are two ways to upload PDF files to the application:

### 1. Manual Upload via Replit Files Panel

This is the recommended method for uploading existing PDF files:

1. Navigate to the `public/pdfs/` directory in the Replit Files panel
2. Click the upload button or drag and drop your PDF files into this directory
3. Files will be immediately available for download without requiring a restart

### 2. Web Interface Upload

For convenience, a web-based upload interface is also available:

1. Navigate to `/admin/upload` in your browser
2. Use the drag & drop interface or file browser to select PDFs
3. Click "Upload" to add files to the system

## File Naming

The system expects specific filenames for different parts of the NALT guide:

1. Complete Guide: `NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf`
2. Part 1: `NALT Uniform Format and Citation Guide (Part One - Background Information to NALT Format).pdf`
3. Part 2: `NALT Guide Part 2 - Cases.pdf`
4. Part 3: `NALT Guide Part 3 - Legislation.pdf`
5. Part 4: `NALT Guide Part 4 - Secondary Sources.pdf`

If you need to use different filenames, modify the `guidelineParts` array in `client/src/components/GuidelineDownloads.tsx` to match your specific filenames.

## Adding New Files

When you add new PDF files:

1. Upload the file using one of the methods above
2. Update the `GuidelineDownloads.tsx` component to include the new file in the UI:
   - Modify the `guidelineParts` array to include your new file
   - Update the `slice(1, 2)` range in the Individual Sections mapping to include your new file index

## Technical Details

- Maximum file size: 50MB per PDF
- Allowed file types: PDF only
- Server endpoint: `/api/downloads/:filename` handles file serving
- Upload endpoint: `/api/upload` processes file uploads