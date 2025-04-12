import { 
  Author, 
  SourceType,
  BookFields, 
  BookChapterFields,
  JournalArticleFields,
  CaseFields,
  StatuteFields,
  OnlineSourceFields,
  ConferencePaperFields,
  NewspaperFields,
  ThesisFields,
  LectureFields,
  EncyclopediaFields,
  MonographFields,
  LectureNoteFields
} from './types';

// Constants
const REQUIRED_FIELD_MESSAGE = 'Required field is missing:';

/**
 * Base formatter class for all citation formats
 */
export abstract class CitationFormatter {
  // Common validation for all citation types
  protected validateCommonFields(fields: any): string[] {
    const errors: string[] = [];
    
    // Check for authors array
    if (!fields.authors || fields.authors.length === 0) {
      errors.push(`${REQUIRED_FIELD_MESSAGE} Author information`);
    }
    
    // Check for title
    if (!fields.title) {
      errors.push(`${REQUIRED_FIELD_MESSAGE} Title`);
    }
    
    return errors;
  }
  
  // Abstract method that must be implemented by subclasses
  abstract format(fields: any): string;
}

/**
 * Book citation formatter
 */
export class BookCitationFormatter extends CitationFormatter {
  format(fields: BookFields): string {
    // Start with author and title
    let citation = `${formatAuthors(fields.authors)}, <i>${fields.title}</i>`;
    
    // Add edition and publisher info
    if (fields.edition) {
      citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
    } else {
      citation += ` (${fields.publisher} ${fields.year})`;
    }
    
    // Add page number if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if available
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Book chapter citation formatter
 */
export class BookChapterCitationFormatter extends CitationFormatter {
  format(fields: BookChapterFields): string {
    // Start with author and chapter title
    let citation = `${formatAuthors(fields.authors)}, '${fields.chapterTitle}' in ${formatEditors(
      fields.editorFirstName,
      fields.editorLastName,
      fields.editorMiddleName,
      fields.secondEditorFirstName,
      fields.secondEditorLastName,
      fields.multipleEditors
    )}, <i>${fields.bookTitle}</i>`;
    
    // Add edition and publisher info
    if (fields.edition) {
      citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
    } else {
      citation += ` (${fields.publisher} ${fields.year})`;
    }
    
    // Add page range if provided
    if (fields.pageRange) {
      citation += ` ${fields.pageRange}`;
    }
    
    // Add online access information if available
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Journal article citation formatter
 */
export class JournalArticleCitationFormatter extends CitationFormatter {
  format(fields: JournalArticleFields): string {
    // Start with author, title and year
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.year})`;
    
    // Add volume and issue
    if (fields.volume) {
      citation += ` ${fields.volume}`;
      
      if (fields.issue) {
        citation += `(${fields.issue})`;
      }
    }
    
    // Add journal title
    citation += ` <i>${fields.journalTitle}</i>`;
    
    // Add page range if provided
    if (fields.startPage) {
      citation += ` ${fields.startPage}`;
      
      if (fields.endPage) {
        citation += `-${fields.endPage}`;
      }
    }
    
    // Add DOI if provided
    if (fields.doi) {
      citation += ` DOI: ${fields.doi}`;
    }
    
    // Add online access information if available
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Case citation formatter
 */
export class CaseCitationFormatter extends CitationFormatter {
  format(fields: CaseFields): string {
    try {
      console.log("CaseCitationFormatter.format called with fields:", fields);
      
      // Validate essential fields
      if (!fields.caseName) {
        console.error("Case citation error: Missing case name");
        return "Error: Missing case name";
      }
      
      // Always start with case name (which is dynamically generated from parties)
      let citation = `<i>${fields.caseName}</i>`;
      
      if (fields.caseType === 'reported') {
        // Validate essential fields for reported cases
        if (!fields.yearReported) {
          console.warn("Case citation warning: Missing year reported");
        }
        if (!fields.lawReportAbbreviation) {
          console.warn("Case citation warning: Missing law report abbreviation");
        }
        
        // Format for reported case
        // [Year] Volume LawReportAbbreviation (Part if available) PageNumber
        citation += ` [${fields.yearReported || ''}]`;
        
        if (fields.volumeNumber) {
          citation += ` ${fields.volumeNumber}`;
        }
        
        if (fields.lawReportAbbreviation) {
          citation += ` ${fields.lawReportAbbreviation}`;
        }
        
        if (fields.partNumber) {
          citation += ` (${fields.partNumber})`;
        }
        
        if (fields.pageNumber) {
          citation += ` ${fields.pageNumber}`;
        }
      } else if (fields.caseType === 'unreported') {
        // Format for unreported case
        if (fields.isUnreportedSimple) {
          // Simple format
          citation += ` (unreported)`;
        } else {
          // Validate essential fields for detailed unreported cases
          if (!fields.caseNumber) {
            console.warn("Case citation warning: Missing case number for unreported case");
          }
          if (!fields.court) {
            console.warn("Case citation warning: Missing court for unreported case");
          }
          
          // Detailed unreported case format
          if (fields.caseNumber) {
            citation += ` ${fields.caseNumber}`;
          }
          
          if (fields.court) {
            citation += ` (${fields.court})`;
          }
          
          if (fields.judgmentDate) {
            citation += ` (${fields.judgmentDate})`;
          }
        }
      }
      
      // Add online access information if applicable
      if (fields.isOnlineSource && fields.webAddress) {
        // Debug: Log online access fields
        console.log("Online access fields:", {
          webAddress: fields.webAddress,
          accessDate: fields.accessDate,
          accessDateDay: fields.accessDateDay,
          accessDateMonth: fields.accessDateMonth,
          accessDateYear: fields.accessDateYear
        });
        
        citation += ` &lt;${fields.webAddress}&gt;`;
        
        // Check if accessDate is available
        if (fields.accessDate) {
          citation += ` accessed ${fields.accessDate}`;
        } 
        // If combined field is not available but individual date parts are, reconstruct it
        else if (fields.accessDateDay && fields.accessDateMonth && fields.accessDateYear) {
          // Get the month name
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const monthIndex = parseInt(fields.accessDateMonth) - 1;
          const monthName = months[monthIndex] || ''; 
          
          // Format: "day monthName year"
          const formattedDate = `${fields.accessDateDay} ${monthName} ${fields.accessDateYear}`;
          citation += ` accessed ${formattedDate}`;
        }
      }
      
      return citation;
    } catch (error) {
      console.error("Case citation formatting error:", error);
      return `Error formatting case citation: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

/**
 * Statute citation formatter
 */
export class StatuteCitationFormatter extends CitationFormatter {
  format(fields: StatuteFields): string {
    // Start with statute title
    let citation = `${fields.statuteTitle}`;
    
    // Add year if provided
    if (fields.year) {
      citation += ` ${fields.year}`;
    }
    
    // Add cap if provided
    if (fields.cap) {
      citation += ` Cap ${fields.cap}`;
    }
    
    // Add jurisdiction
    citation += ` (${fields.jurisdiction})`;
    
    // Add section if provided
    if (fields.section) {
      citation += `, s ${fields.section}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Online source citation formatter
 */
export class OnlineSourceCitationFormatter extends CitationFormatter {
  format(fields: OnlineSourceFields): string {
    // Start with author and title
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}'`;
    
    // Add publisher if provided
    if (fields.publisher) {
      citation += ` (${fields.publisher},`;
    } else {
      citation += ` (`;
    }
    
    // Add year, website title, URL and access date
    citation += ` ${fields.year}) <i>${fields.websiteTitle}</i> &lt;${fields.url}&gt; accessed ${fields.accessDate}`;
    
    return citation;
  }
}

/**
 * Conference paper citation formatter
 */
export class ConferencePaperCitationFormatter extends CitationFormatter {
  format(fields: ConferencePaperFields): string {
    // Format citation for conference paper
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (Paper presented at the ${fields.conferenceName}, ${fields.conferenceLocation}, ${fields.conferenceDate})`;
    
    // Add page if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Newspaper citation formatter
 */
export class NewspaperCitationFormatter extends CitationFormatter {
  format(fields: NewspaperFields): string {
    // Format citation for newspaper
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' <i>${fields.newspaperTitle}</i> (${fields.date})`;
    
    // Add page if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Thesis citation formatter
 */
export class ThesisCitationFormatter extends CitationFormatter {
  format(fields: ThesisFields): string {
    // Format citation for thesis
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.thesisType}, ${fields.institution} ${fields.year})`;
    
    // Add page if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Lecture citation formatter
 */
export class LectureCitationFormatter extends CitationFormatter {
  format(fields: LectureFields): string {
    // Format citation for lecture
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.lectureType}, ${fields.institution}, ${fields.date})`;
    
    // Add location if provided
    if (fields.location) {
      citation += ` ${fields.location}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Encyclopedia citation formatter
 */
export class EncyclopediaCitationFormatter extends CitationFormatter {
  format(fields: EncyclopediaFields): string {
    // Format citation for encyclopedia entry
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' in <i>${fields.encyclopediaTitle}</i>`;
    
    // Add volume if provided
    if (fields.volume) {
      citation += ` vol ${fields.volume}`;
    }
    
    // Add edition, publisher and year
    if (fields.edition) {
      citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
    } else {
      citation += ` (${fields.publisher} ${fields.year})`;
    }
    
    // Add page if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Monograph citation formatter
 */
export class MonographCitationFormatter extends CitationFormatter {
  format(fields: MonographFields): string {
    // Format citation for monograph
    let citation = `${formatAuthors(fields.authors)}, <i>${fields.title}</i>`;
    
    // Add series if provided
    if (fields.series) {
      citation += ` (${fields.series},`;
    } else {
      citation += ` (`;
    }
    
    // Add publisher and year
    citation += `${fields.publisher} ${fields.year})`;
    
    // Add page if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if available
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Lecture note citation formatter
 */
export class LectureNoteCitationFormatter extends CitationFormatter {
  format(fields: LectureNoteFields): string {
    // Start the citation with author and title
    let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (`;
    
    // Add descriptor with audience if present
    if (fields.audience) {
      citation += `A Lecture Note prepared for ${fields.audience} of the `;
    } else {
      citation += 'Lecture Note, ';
    }
    
    // Add course and institution
    citation += `${fields.course ? fields.course + ', ' : ''}${fields.institution}, ${fields.date})`;
    
    // Add additional information if provided
    if (fields.additionalInfo) {
      citation += ` ${fields.additionalInfo}`;
    }
    
    // Add page number if provided
    if (fields.page) {
      citation += ` ${fields.page}`;
    }
    
    // Add online access information if applicable
    if (fields.isOnlineSource && fields.webAddress) {
      citation += ` &lt;${fields.webAddress}&gt;`;
      
      if (fields.accessDate) {
        citation += ` accessed ${fields.accessDate}`;
      }
    }
    
    return citation;
  }
}

/**
 * Factory for creating citation formatters based on source type
 */
export class CitationFormatterFactory {
  static getFormatter(sourceType: SourceType): CitationFormatter {
    switch (sourceType) {
      case 'book':
        return new BookCitationFormatter();
      case 'bookChapter':
        return new BookChapterCitationFormatter();
      case 'journalArticle':
        return new JournalArticleCitationFormatter();
      case 'case':
        return new CaseCitationFormatter();
      case 'statute':
        return new StatuteCitationFormatter();
      case 'onlineSource':
        return new OnlineSourceCitationFormatter();
      case 'conferencePaper':
        return new ConferencePaperCitationFormatter();
      case 'newspaper':
        return new NewspaperCitationFormatter();
      case 'thesis':
        return new ThesisCitationFormatter();
      case 'lecture':
        return new LectureCitationFormatter();
      case 'encyclopedia':
        return new EncyclopediaCitationFormatter();
      case 'monograph':
        return new MonographCitationFormatter();
      case 'lectureNote':
        return new LectureNoteCitationFormatter();
      default:
        throw new Error(`Citation format for source type '${sourceType}' is not supported`);
    }
  }
}

// Helper function to format author names according to NALT style
export function formatAuthor(author: Author): string {
  if (author.isOrganization) {
    return author.lastName; // Organization name
  }

  if (author.middleName) {
    return `${author.firstName.charAt(0)} ${author.middleName.charAt(0)} ${author.lastName}`;
  }
  
  return `${author.firstName.charAt(0)} ${author.lastName}`;
}

// Helper function to format multiple authors
export function formatAuthors(authors: Author[] = []): string {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }
  
  if (authors.length === 1) {
    return formatAuthor(authors[0]);
  }
  
  if (authors.length === 2) {
    return `${formatAuthor(authors[0])} and ${formatAuthor(authors[1])}`;
  }
  
  // For 3 or more authors
  const allButLast = authors.slice(0, authors.length - 1);
  const last = authors[authors.length - 1];
  
  return `${allButLast.map(formatAuthor).join(', ')} and ${formatAuthor(last)}`;
}

// Helper function to format an editor or multiple editors
export function formatEditors(
  firstName: string, 
  lastName: string, 
  middleName?: string, 
  secondFirstName?: string, 
  secondLastName?: string, 
  multipleEditors: boolean = false
): string {
  let editorStr = middleName 
    ? `${firstName.charAt(0)} ${middleName.charAt(0)} ${lastName}`
    : `${firstName.charAt(0)} ${lastName}`;
    
  if (multipleEditors && secondFirstName && secondLastName) {
    editorStr += ` and ${secondFirstName.charAt(0)} ${secondLastName}`;
  }
  
  return `${editorStr} (ed${multipleEditors ? 's' : ''})`;
}