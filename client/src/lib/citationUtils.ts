import { 
  Author, 
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
export function formatAuthors(authors: Author[]): string {
  if (!authors || authors.length === 0) {
    return '';
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

// Format a book citation
export function formatBookCitation(fields: BookFields): string {
  let citation = `${formatAuthors(fields.authors)}, <i>${fields.title}</i>`;
  
  if (fields.edition) {
    citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
  } else {
    citation += ` (${fields.publisher} ${fields.year})`;
  }
  
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

// Format a book chapter citation
export function formatBookChapterCitation(fields: BookChapterFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.chapterTitle}' in ${formatEditors(
    fields.editorFirstName,
    fields.editorLastName,
    fields.editorMiddleName,
    fields.secondEditorFirstName,
    fields.secondEditorLastName,
    fields.multipleEditors
  )}, <i>${fields.bookTitle}</i>`;
  
  if (fields.edition) {
    citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
  } else {
    citation += ` (${fields.publisher} ${fields.year})`;
  }
  
  if (fields.pageRange) {
    citation += ` ${fields.pageRange}`;
  }
  
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a journal article citation
export function formatJournalArticleCitation(fields: JournalArticleFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.year})`;
  
  if (fields.volume) {
    citation += ` ${fields.volume}`;
    
    if (fields.issue) {
      citation += `(${fields.issue})`;
    }
  }
  
  citation += ` <i>${fields.journalTitle}</i>`;
  
  if (fields.startPage) {
    citation += ` ${fields.startPage}`;
    
    if (fields.endPage) {
      citation += `-${fields.endPage}`;
    }
  }
  
  if (fields.doi) {
    citation += ` DOI: ${fields.doi}`;
  }
  
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a case citation
export function formatCaseCitation(fields: CaseFields): string {
  let citation = `<i>${fields.caseName}</i> ${fields.citation}`;
  
  if (fields.court) {
    citation += ` (${fields.court})`;
  }
  
  if (fields.judgmentDate) {
    citation += ` (${fields.judgmentDate})`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a statute citation
export function formatStatuteCitation(fields: StatuteFields): string {
  let citation = `${fields.statuteTitle}`;
  
  if (fields.year) {
    citation += ` ${fields.year}`;
  }
  
  if (fields.cap) {
    citation += ` Cap ${fields.cap}`;
  }
  
  citation += ` (${fields.jurisdiction})`;
  
  if (fields.section) {
    citation += `, s ${fields.section}`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format an online source citation
export function formatOnlineSourceCitation(fields: OnlineSourceFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}'`;
  
  if (fields.publisher) {
    citation += ` (${fields.publisher},`;
  } else {
    citation += ` (`;
  }
  
  citation += ` ${fields.year}) <i>${fields.websiteTitle}</i> <${fields.url}> accessed ${fields.accessDate}`;
  
  return citation;
}

// Format a conference paper citation
export function formatConferencePaperCitation(fields: ConferencePaperFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (Paper presented at the ${fields.conferenceName}, ${fields.conferenceLocation}, ${fields.conferenceDate})`;
  
  if (fields.page) {
    citation += ` ${fields.page}`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a newspaper citation
export function formatNewspaperCitation(fields: NewspaperFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' <i>${fields.newspaperTitle}</i> (${fields.date})`;
  
  if (fields.page) {
    citation += ` ${fields.page}`;
  }
  
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a thesis citation
export function formatThesisCitation(fields: ThesisFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.thesisType}, ${fields.institution} ${fields.year})`;
  
  if (fields.page) {
    citation += ` ${fields.page}`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a lecture citation
export function formatLectureCitation(fields: LectureFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' (${fields.lectureType}, ${fields.institution}, ${fields.date})`;
  
  if (fields.location) {
    citation += ` ${fields.location}`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format an encyclopedia citation
export function formatEncyclopediaCitation(fields: EncyclopediaFields): string {
  let citation = `${formatAuthors(fields.authors)}, '${fields.title}' in <i>${fields.encyclopediaTitle}</i>`;
  
  if (fields.volume) {
    citation += ` vol ${fields.volume}`;
  }
  
  if (fields.edition) {
    citation += ` (${fields.edition}, ${fields.publisher} ${fields.year})`;
  } else {
    citation += ` (${fields.publisher} ${fields.year})`;
  }
  
  if (fields.page) {
    citation += ` ${fields.page}`;
  }
  
  // Add online access information if applicable
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a monograph citation
export function formatMonographCitation(fields: MonographFields): string {
  let citation = `${formatAuthors(fields.authors)}, <i>${fields.title}</i>`;
  
  if (fields.series) {
    citation += ` (${fields.series},`;
  } else {
    citation += ` (`;
  }
  
  citation += `${fields.publisher} ${fields.year})`;
  
  if (fields.page) {
    citation += ` ${fields.page}`;
  }
  
  // Add online access information if available
  if (fields.isOnlineSource && fields.webAddress) {
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Format a lecture note citation
export function formatLectureNoteCitation(fields: LectureNoteFields): string {
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
    citation += ` <${fields.webAddress}>`;
    
    if (fields.accessDate) {
      citation += ` accessed ${fields.accessDate}`;
    }
  }
  
  return citation;
}

// Main function to generate citation based on source type
export function generateCitation(fields: any): string {
  switch (fields.sourceType) {
    case 'book':
      return formatBookCitation(fields as BookFields);
    case 'bookChapter':
      return formatBookChapterCitation(fields as BookChapterFields);
    case 'journalArticle':
      return formatJournalArticleCitation(fields as JournalArticleFields);
    case 'case':
      return formatCaseCitation(fields as CaseFields);
    case 'statute':
      return formatStatuteCitation(fields as StatuteFields);
    case 'onlineSource':
      return formatOnlineSourceCitation(fields as OnlineSourceFields);
    case 'conferencePaper':
      return formatConferencePaperCitation(fields as ConferencePaperFields);
    case 'newspaper':
      return formatNewspaperCitation(fields as NewspaperFields);
    case 'thesis':
      return formatThesisCitation(fields as ThesisFields);
    case 'lecture':
      return formatLectureCitation(fields as LectureFields);
    case 'encyclopedia':
      return formatEncyclopediaCitation(fields as EncyclopediaFields);
    case 'monograph':
      return formatMonographCitation(fields as MonographFields);
    case 'lectureNote':
      return formatLectureNoteCitation(fields as LectureNoteFields);
    default:
      return "Citation format not supported";
  }
}