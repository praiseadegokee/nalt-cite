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

// Citation generator types
export type SourceType = 
  | 'case' 
  | 'statute' 
  | 'book' 
  | 'bookChapter' 
  | 'journalArticle' 
  | 'onlineSource' 
  | 'conferencePaper'
  | 'newspaper'
  | 'thesis'
  | 'lecture'
  | 'encyclopedia'
  | 'monograph'
  | 'lectureNote';

export interface Author {
  firstName: string;
  middleName?: string;
  lastName: string;
  isOrganization: boolean;
}

export interface BaseCitationFields {
  sourceType: SourceType;
  authors: Author[];
  title: string;
  year: string;
}

export interface BookFields extends BaseCitationFields {
  edition?: string;
  publisher: string;
  page?: string;
}

export interface BookChapterFields extends BaseCitationFields {
  bookTitle: string;
  chapterTitle: string;
  editorFirstName: string;
  editorMiddleName?: string;
  editorLastName: string;
  secondEditorFirstName?: string;
  secondEditorLastName?: string;
  multipleEditors: boolean;
  edition?: string;
  publisher: string;
  pageRange?: string;
  isOnlineSource: boolean;
  webAddress?: string;
  accessDate?: string;
}

export interface JournalArticleFields extends BaseCitationFields {
  journalTitle: string;
  volume?: string;
  issue?: string;
  startPage?: string;
  endPage?: string;
  doi?: string;
  isOnlineSource: boolean;
  webAddress?: string;
  accessDate?: string;
}

export interface CaseFields extends BaseCitationFields {
  caseName: string;
  citation: string;
  court?: string;
  judgmentDate?: string;
}

export interface StatuteFields extends BaseCitationFields {
  statuteTitle: string;
  jurisdiction: string;
  section?: string;
  year: string;
  cap?: string;
}

export interface OnlineSourceFields extends BaseCitationFields {
  websiteTitle: string;
  url: string;
  accessDate: string;
  publisher?: string;
}

export interface ConferencePaperFields extends BaseCitationFields {
  conferenceName: string;
  conferenceLocation: string;
  conferenceDate: string;
  page?: string;
}

export interface NewspaperFields extends BaseCitationFields {
  newspaperTitle: string;
  date: string;  // Publication date in full format (e.g., "15 January 2023")
  page?: string;
  isOnlineSource: boolean;
  webAddress?: string;
  accessDate?: string;
}

export interface ThesisFields extends BaseCitationFields {
  thesisType: string; // "PhD Dissertation", "LLM Thesis", etc.
  institution: string;
  year: string;
  page?: string;
}

export interface LectureFields extends BaseCitationFields {
  lectureType: string; // "Inaugural Lecture", "Distinguished Lecture", etc.
  institution: string;
  date: string;
  location?: string;
}

export interface EncyclopediaFields extends BaseCitationFields {
  encyclopediaTitle: string;
  volume?: string;
  edition?: string;
  publisher: string;
  year: string;
  page?: string;
}

export interface MonographFields extends BaseCitationFields {
  series?: string;
  publisher: string;
  year: string;
  page?: string;
}

export interface LectureNoteFields extends BaseCitationFields {
  course: string;
  institution: string;
  date: string;
  page?: string;
}

// Union type of all citation field types for use in citation generator
export type CitationFields = 
  | BookFields 
  | BookChapterFields 
  | JournalArticleFields 
  | CaseFields 
  | StatuteFields 
  | OnlineSourceFields
  | ConferencePaperFields
  | NewspaperFields
  | ThesisFields
  | LectureFields
  | EncyclopediaFields
  | MonographFields
  | LectureNoteFields;
