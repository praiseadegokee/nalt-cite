import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getRequiredFieldsBySourceType(sourceType: string): string[] {
  const commonFields = ['title', 'year'];
  
  switch (sourceType) {
    case 'book':
      return [...commonFields, 'publisher'];
    case 'bookChapter':
      return [...commonFields, 'bookTitle', 'chapterTitle', 'publisher'];
    case 'journalArticle':
      return [...commonFields, 'journalTitle'];
    case 'case':
      return ['caseName', 'citation'];
    case 'statute':
      return ['statuteTitle', 'jurisdiction'];
    case 'onlineSource':
      return [...commonFields, 'websiteTitle', 'url', 'accessDate'];
    default:
      return commonFields;
  }
}
