import { SourceType } from './types';

/**
 * Gets a list of required fields for a given source type
 */
export function getRequiredFieldsBySourceType(sourceType: SourceType): string[] {
  const commonFields = ['title', 'year', 'authors'];
  
  switch(sourceType) {
    case 'book':
      return [...commonFields, 'publisher'];
      
    case 'bookChapter':
      return [...commonFields, 'bookTitle', 'chapterTitle', 'editorLastName', 'editorFirstName', 'publisher'];
      
    case 'journalArticle':
      return [...commonFields, 'journalTitle'];
      
    case 'case':
      return ['caseName', 'citation'];
      
    case 'statute':
      return ['statuteTitle', 'year', 'jurisdiction'];
      
    case 'onlineSource':
      return [...commonFields, 'websiteTitle', 'url', 'accessDate'];
      
    case 'conferencePaper':
      return [...commonFields, 'conferenceName', 'conferenceLocation', 'conferenceDate'];
      
    case 'newspaper':
      return [...commonFields, 'newspaperTitle', 'date'];
      
    case 'thesis':
      return [...commonFields, 'thesisType', 'institution'];
      
    case 'lecture':
      return [...commonFields, 'lectureType', 'institution', 'date'];
      
    case 'encyclopedia':
      return [...commonFields, 'encyclopediaTitle', 'publisher'];
      
    case 'monograph':
      return [...commonFields, 'publisher'];
      
    case 'lectureNote':
      return [...commonFields, 'course', 'institution', 'date'];
      
    default:
      return commonFields;
  }
}

/**
 * Validates if all required fields for a source type are filled
 */
export function validateSourceFields(data: any, sourceType: SourceType): { isValid: boolean; missingFields: string[] } {
  if (!sourceType) {
    return { isValid: false, missingFields: ['sourceType'] };
  }
  
  const requiredFields = getRequiredFieldsBySourceType(sourceType);
  const missingFields: string[] = [];
  
  // Special handling for authors array
  if (requiredFields.includes('authors')) {
    if (!data.authors || data.authors.length === 0) {
      missingFields.push('authors');
    } else {
      // Check if all authors have required fields
      const authorsValid = data.authors.every((author: any) => {
        if (author.isOrganization) {
          return !!author.lastName;
        }
        return !!author.lastName;
      });
      
      if (!authorsValid) {
        missingFields.push('authors (incomplete)');
      }
    }
  }
  
  // Check other required fields
  requiredFields
    .filter(field => field !== 'authors')
    .forEach(field => {
      if (!data[field]) {
        missingFields.push(field);
      }
    });
  
  // Special handling for online sources with access date
  if (data.isOnlineSource) {
    if (!data.webAddress) {
      missingFields.push('webAddress');
    }
    if (!data.accessDate) {
      missingFields.push('accessDate');
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}