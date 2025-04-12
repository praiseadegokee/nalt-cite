// Types for the application

import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkText: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: number;
  category: string;
  image?: string;
  tags?: string[];
}

export interface Resource {
  title: string;
  description: string;
  type: 'pdf' | 'docx' | 'video' | 'image';
  size?: string;
  downloadUrl: string;
  category: string;
}

export interface CitationSource {
  id: string;
  value: string;
  label: string;
}

export interface CitationFormat {
  id: string;
  fields: string[];
  template: (data: Record<string, string>) => string;
}
