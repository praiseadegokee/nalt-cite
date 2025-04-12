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

export type SourceType = 'book' | 'bookChapter' | 'journalArticle' | 'case' | 'statute' | 'thesis' | 'webResource' | 'newspaper' | 'conferencePaper' | 'lecture' | 'encyclopedia';

export interface Author {
  firstName: string;
  middleName?: string;
  lastName: string;
  isOrganization: boolean;
}

export interface BaseFormData {
  sourceType: SourceType;
  authors: Author[];
  title?: string;
  isOnlineSource?: boolean;
  websiteUrl?: string;
  accessDate?: string;
}

export interface BookFormData extends BaseFormData {
  sourceType: 'book';
  edition?: string;
  publisher?: string;
  year?: string;
  page?: string;
}

export interface BookChapterFormData extends BaseFormData {
  sourceType: 'bookChapter';
  chapterTitle?: string;
  bookTitle?: string;
  editorFirstName?: string;
  editorMiddleName?: string;
  editorLastName?: string;
  secondEditorFirstName?: string;
  secondEditorLastName?: string;
  multipleEditors?: boolean;
  edition?: string;
  publisher?: string;
  year?: string;
  pageRange?: string;
}

export interface JournalArticleFormData extends BaseFormData {
  sourceType: 'journalArticle';
  journalName?: string;
  volume?: string;
  issue?: string;
  year?: string;
  startPage?: string;
  endPage?: string;
}

export interface CaseFormData extends BaseFormData {
  sourceType: 'case';
  caseName?: string;
  year?: string;
  volume?: string;
  reporter?: string;
  lawReportCustom?: string;
  court?: string;
  page?: string;
}

export interface StatuteFormData extends BaseFormData {
  sourceType: 'statute';
  name?: string;
  year?: string;
  section?: string;
  country?: string;
}

export interface ThesisFormData extends BaseFormData {
  sourceType: 'thesis';
  university?: string;
  year?: string;
  thesisType?: string;
}

export interface WebResourceFormData extends BaseFormData {
  sourceType: 'webResource';
  websiteName?: string;
  publicationDate?: string;
}

export interface NewspaperFormData extends BaseFormData {
  sourceType: 'newspaper';
  newspaperName?: string;
  publicationDate?: string;
  page?: string;
}

export interface ConferencePaperFormData extends BaseFormData {
  sourceType: 'conferencePaper';
  proceedingsTitle?: string;
  conferenceName?: string;
  conferenceLocation?: string;
  conferenceDates?: string;
  page?: string;
}

export interface LectureFormData extends BaseFormData {
  sourceType: 'lecture';
  lectureType?: string;
  occasion?: string;
  presentationPlace?: string;
  presentationDate?: string;
}

export interface EncyclopediaFormData extends BaseFormData {
  sourceType: 'encyclopedia';
  edition?: string;
  year?: string;
  volume?: string;
  paragraph?: string;
}
