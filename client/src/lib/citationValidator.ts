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
      return ['caseName', 'caseType', 'parties'];
      
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
  
  // Special handling for case parties
  if (requiredFields.includes('parties')) {
    if (!data.parties || data.parties.length === 0) {
      missingFields.push('parties');
    } else {
      // Check that we have at least one plaintiff/appellant and one defendant/respondent
      const plaintiffFound = data.parties.some((party: any) => 
        ['Plaintiff', 'Appellant', 'Applicant', 'Petitioner'].includes(party.role) && party.name
      );
      
      const defendantFound = data.parties.some((party: any) => 
        ['Defendant', 'Respondent', 'Accused', 'Objector'].includes(party.role) && party.name
      );
      
      if (!plaintiffFound) {
        missingFields.push('plaintiff party information');
      }
      
      if (!defendantFound) {
        missingFields.push('defendant party information');
      }
    }
  }
  
  // Check other required fields
  requiredFields
    .filter(field => field !== 'authors' && field !== 'parties')
    .forEach(field => {
      if (!data[field]) {
        missingFields.push(field);
      }
    });
  
  // Special handling for case source types - reported vs unreported
  if (sourceType === 'case' && data.caseType) {
    if (data.caseType === 'reported') {
      // Check for required reported case fields
      if (!data.yearReported) {
        missingFields.push('yearReported');
      }
      if (!data.lawReportAbbreviation) {
        missingFields.push('lawReportAbbreviation');
      }
      if (!data.pageNumber) {
        missingFields.push('pageNumber');
      }
    } else if (data.caseType === 'unreported' && !data.isUnreportedSimple) {
      // Check for required unreported case fields (only if not using simplified format)
      if (!data.caseNumber) {
        missingFields.push('caseNumber');
      }
      if (!data.court) {
        missingFields.push('court');
      }
      if (!data.judgmentDate) {
        missingFields.push('judgmentDate');
      }
    }
  }
  
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