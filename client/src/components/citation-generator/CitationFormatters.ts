import {
  Author,
  BookFormData,
  BookChapterFormData,
  JournalArticleFormData,
  CaseFormData,
  StatuteFormData,
  ThesisFormData,
  WebResourceFormData,
  NewspaperFormData,
  ConferencePaperFormData,
  LectureFormData,
  EncyclopediaFormData
} from '../../lib/types';

export function formatAuthor(author: Author): string {
  if (author.isOrganization) {
    return author.lastName;
  }
  
  const lastName = author.lastName.trim();
  const firstName = author.firstName.trim();
  const middleName = author.middleName?.trim() || '';
  
  const initials = firstName ? firstName.charAt(0) : '';
  const middleInitial = middleName ? middleName.charAt(0) : '';
  
  if (middleInitial) {
    return `${lastName} ${initials}.${middleInitial}.`;
  }
  
  return `${lastName} ${initials}.`;
}

export function formatAuthors(authors: Author[], bibliography = false): string {
  if (!authors || authors.length === 0) return '';
  
  if (authors.length === 1) {
    const author = authors[0];
    if (bibliography) {
      if (author.isOrganization) {
        return author.lastName;
      }
      return `${author.lastName}, ${author.firstName.charAt(0)}${author.middleName ? '. ' + author.middleName.charAt(0) : ''}.`;
    }
    return formatAuthor(author);
  }
  
  if (authors.length === 2) {
    if (bibliography) {
      return `${formatAuthor(authors[0])} and ${formatAuthor(authors[1])}`;
    }
    return `${formatAuthor(authors[0])} & ${formatAuthor(authors[1])}`;
  }
  
  if (bibliography) {
    return `${formatAuthor(authors[0])}, ${formatAuthor(authors[1])} and ${formatAuthor(authors[2])}`;
  }
  return `${formatAuthor(authors[0])} et al`;
}

// Book citation formatters
export function formatBookCitation(data: BookFormData, footnote = true): string {
  let citation = '';
  
  // Regular book
  citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `<em>${data.title}</em>`;
  if (data.edition && data.edition.trim() !== '') citation += `, ${data.edition}`;
  if (data.publisher) citation += ` (${data.publisher}`;
  if (data.year) citation += `, ${data.year})`;
  else if (data.publisher) citation += ')';
  
  if (data.page) citation += ` ${data.page}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatBookBibliography(data: BookFormData): string {
  let citation = '';
  
  // Regular book
  citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `<em>${data.title}</em>`;
  if (data.edition && data.edition.trim() !== '') citation += `, ${data.edition}`;
  if (data.publisher) citation += ` (${data.publisher}`;
  if (data.year) citation += `, ${data.year})`;
  else if (data.publisher) citation += ')';
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Book Chapter citation formatters
export function formatBookChapterCitation(data: BookChapterFormData, footnote = true): string {
  console.log('Book Chapter formatter data:', data);
  let citation = '';
  
  // Chapter in an edited book
  citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.chapterTitle) citation += `'${data.chapterTitle}'${data.chapterTitle.endsWith('?') ? '' : ','} `;
  citation += 'in ';
  
  // Format editor information
  let hasEditors = false;
  let hasMultipleEditors = data.multipleEditors || false;
  
  if (data.editorFirstName && data.editorLastName) {
    hasEditors = true;
    const editorInitial = data.editorFirstName.charAt(0);
    const editorMiddleInitial = data.editorMiddleName ? data.editorMiddleName.charAt(0) + '.' : '';
    
    if (editorMiddleInitial) {
      citation += `${editorInitial}.${editorMiddleInitial} ${data.editorLastName}`;
    } else {
      citation += `${editorInitial}. ${data.editorLastName}`;
    }
    
    // Check for second editor
    if (data.secondEditorFirstName && data.secondEditorLastName) {
      const secondEditorInitial = data.secondEditorFirstName.charAt(0);
      citation += ` and ${secondEditorInitial}. ${data.secondEditorLastName}`;
      hasMultipleEditors = true; // Force multiple editors formatting
    }
    
    // Use (eds) for multiple editors, otherwise (ed)
    citation += hasMultipleEditors ? ' (eds), ' : ' (ed), ';
  }
  
  if (data.bookTitle) citation += `<em>${data.bookTitle}</em>`;
  if (data.edition && data.edition.trim() !== '') citation += `, ${data.edition}`;
  if (data.publisher) citation += ` (${data.publisher}`;
  if (data.year) citation += `, ${data.year})`;
  else if (data.publisher) citation += ')';
  
  if (data.pageRange) citation += ` ${data.pageRange}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource) {
    // Use webAddress if available, fallback to websiteUrl
    const url = data.webAddress || data.websiteUrl;
    if (url) {
      citation += ` <${url}>`;
      if (data.accessDate) citation += ` accessed ${data.accessDate}`;
    }
  }
  
  return citation;
}

export function formatBookChapterBibliography(data: BookChapterFormData): string {
  console.log('Book Chapter bibliography formatter data:', data);
  let citation = '';
  
  // Chapter in an edited book
  citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.chapterTitle) citation += `'${data.chapterTitle}'${data.chapterTitle.endsWith('?') ? '' : ','} `;
  citation += 'in ';
  
  // Format editor information
  let hasEditors = false;
  let hasMultipleEditors = data.multipleEditors || false;
  
  if (data.editorFirstName && data.editorLastName) {
    hasEditors = true;
    const editorInitial = data.editorFirstName.charAt(0);
    const editorMiddleInitial = data.editorMiddleName ? data.editorMiddleName.charAt(0) + '.' : '';
    
    if (editorMiddleInitial) {
      citation += `${editorInitial}.${editorMiddleInitial} ${data.editorLastName}`;
    } else {
      citation += `${editorInitial}. ${data.editorLastName}`;
    }
    
    // Check for second editor
    if (data.secondEditorFirstName && data.secondEditorLastName) {
      const secondEditorInitial = data.secondEditorFirstName.charAt(0);
      citation += ` and ${secondEditorInitial}. ${data.secondEditorLastName}`;
      hasMultipleEditors = true; // Force multiple editors formatting
    }
    
    // Use (eds) for multiple editors, otherwise (ed)
    citation += hasMultipleEditors ? ' (eds), ' : ' (ed), ';
  }
  
  if (data.bookTitle) citation += `<em>${data.bookTitle}</em>`;
  if (data.edition && data.edition.trim() !== '') citation += `, ${data.edition}`;
  if (data.publisher) citation += ` (${data.publisher}`;
  if (data.year) citation += `, ${data.year})`;
  else if (data.publisher) citation += ')';
  
  if (data.pageRange) citation += ` ${data.pageRange}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource) {
    // Use webAddress if available, fallback to websiteUrl
    const url = data.webAddress || data.websiteUrl;
    if (url) {
      citation += ` <${url}>`;
      if (data.accessDate) citation += ` accessed ${data.accessDate}`;
    }
  }
  
  return citation;
}

// Journal article citation formatters
export function formatJournalCitation(data: JournalArticleFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.journalName) citation += `(${data.year}) `;
  
  if (data.volume) {
    citation += `<em>${data.volume}`;
    if (data.journalName) citation += ` ${data.journalName}`;
    citation += '</em>';
  } else if (data.journalName) {
    citation += `<em>${data.journalName}</em>`;
  }
  
  if (data.issue) citation += ` ${data.issue}`;
  
  if (data.startPage && data.endPage) {
    citation += `, ${data.startPage}-${data.endPage}`;
  } else if (data.startPage) {
    citation += `, ${data.startPage}`;
  }
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatJournalBibliography(data: JournalArticleFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.journalName) citation += `(${data.year}) `;
  
  if (data.volume) {
    citation += `<em>${data.volume}`;
    if (data.journalName) citation += ` ${data.journalName}`;
    citation += '</em>';
  } else if (data.journalName) {
    citation += `<em>${data.journalName}</em>`;
  }
  
  if (data.issue) citation += ` ${data.issue}`;
  
  if (data.startPage && data.endPage) {
    citation += `, ${data.startPage}-${data.endPage}`;
  } else if (data.startPage) {
    citation += `, ${data.startPage}`;
  }
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Case citation formatters
export function formatCaseCitation(data: CaseFormData, footnote = true): string {
  let citation = '';
  
  if (data.caseName) citation += `<em>${data.caseName}</em> `;
  
  if (data.reporter) {
    if (data.volume && data.year && data.page) {
      citation += `[${data.year}] ${data.volume} ${data.reporter} ${data.page}`;
    } else if (data.year && data.reporter) {
      citation += `(${data.year}) ${data.reporter}`;
      if (data.page) citation += ` ${data.page}`;
    }
  } else if (data.lawReportCustom) {
    citation += data.lawReportCustom;
  }
  
  if (data.court) citation += ` (${data.court})`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatCaseBibliography(data: CaseFormData): string {
  // For bibliography, case citations typically remain the same as the footnote format
  return formatCaseCitation(data, false);
}

// Statute citation formatters
export function formatStatuteCitation(data: StatuteFormData, footnote = true): string {
  let citation = '';
  
  if (data.name) citation += `${data.name}`;
  if (data.year) citation += ` ${data.year}`;
  if (data.section) citation += `, s ${data.section}`;
  if (data.country) citation += ` (${data.country})`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatStatuteBibliography(data: StatuteFormData): string {
  // For bibliography, statute citations typically remain the same as the footnote format
  return formatStatuteCitation(data, false);
}

// Thesis citation formatters
export function formatThesisCitation(data: ThesisFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.thesisType) citation += `(${data.thesisType} thesis, `;
  else citation += '(thesis, ';
  
  if (data.university) citation += `${data.university}`;
  if (data.year) citation += `, ${data.year})`;
  else citation += ')';
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatThesisBibliography(data: ThesisFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.thesisType) citation += `(${data.thesisType} thesis, `;
  else citation += '(thesis, ';
  
  if (data.university) citation += `${data.university}`;
  if (data.year) citation += `, ${data.year})`;
  else citation += ')';
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Web resource citation formatters
export function formatWebResourceCitation(data: WebResourceFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.websiteName) citation += `${data.websiteName}`;
  if (data.publicationDate) citation += ` (${data.publicationDate})`;
  
  if (data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatWebResourceBibliography(data: WebResourceFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.websiteName) citation += `${data.websiteName}`;
  if (data.publicationDate) citation += ` (${data.publicationDate})`;
  
  if (data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Newspaper citation formatters
export function formatNewspaperCitation(data: NewspaperFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.newspaperName) citation += `<em>${data.newspaperName}</em>`;
  if (data.publicationDate) citation += ` (${data.publicationDate})`;
  if (data.page) citation += ` ${data.page}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatNewspaperBibliography(data: NewspaperFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  if (data.newspaperName) citation += `<em>${data.newspaperName}</em>`;
  if (data.publicationDate) citation += ` (${data.publicationDate})`;
  if (data.page) citation += ` ${data.page}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Conference Paper citation formatters
export function formatConferencePaperCitation(data: ConferencePaperFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  
  if (data.proceedingsTitle) citation += `in <em>${data.proceedingsTitle}</em>`;
  
  if (data.conferenceName || data.conferenceLocation) {
    citation += ': ';
    if (data.conferenceName) citation += data.conferenceName;
    if (data.conferenceName && data.conferenceLocation) citation += ', ';
    if (data.conferenceLocation) citation += data.conferenceLocation;
  }
  
  if (data.conferenceDates) citation += ` (${data.conferenceDates})`;
  
  if (data.page) citation += `, ${data.page}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatConferencePaperBibliography(data: ConferencePaperFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  
  if (data.proceedingsTitle) citation += `in <em>${data.proceedingsTitle}</em>`;
  
  if (data.conferenceName || data.conferenceLocation) {
    citation += ': ';
    if (data.conferenceName) citation += data.conferenceName;
    if (data.conferenceName && data.conferenceLocation) citation += ', ';
    if (data.conferenceLocation) citation += data.conferenceLocation;
  }
  
  if (data.conferenceDates) citation += ` (${data.conferenceDates})`;
  
  if (data.page) citation += `, ${data.page}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Lecture citation formatters
export function formatLectureCitation(data: LectureFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  
  if (data.lectureType) citation += `(${data.lectureType}`;
  else citation += '(lecture';
  
  if (data.occasion) citation += ` presented at ${data.occasion}`;
  if (data.presentationPlace) citation += `, ${data.presentationPlace}`;
  if (data.presentationDate) citation += `, ${data.presentationDate}`;
  citation += ')';
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatLectureBibliography(data: LectureFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
  
  if (data.lectureType) citation += `(${data.lectureType}`;
  else citation += '(lecture';
  
  if (data.occasion) citation += ` presented at ${data.occasion}`;
  if (data.presentationPlace) citation += `, ${data.presentationPlace}`;
  if (data.presentationDate) citation += `, ${data.presentationDate}`;
  citation += ')';
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Encyclopedia citation formatters
export function formatEncyclopediaCitation(data: EncyclopediaFormData, footnote = true): string {
  let citation = formatAuthors(data.authors);
  if (citation) citation += ', ';
  
  if (data.title) {
    citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
    citation += `in <em>Halsbury's Laws of England</em>`;
  } else {
    citation += `in <em>Halsbury's Laws of England</em>`;
  }
  
  if (data.edition) citation += `, ${data.edition}`;
  if (data.volume) citation += `, vol ${data.volume}`;
  if (data.year) citation += ` (${data.year})`;
  if (data.paragraph) citation += `, para ${data.paragraph}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

export function formatEncyclopediaBibliography(data: EncyclopediaFormData): string {
  let citation = formatAuthors(data.authors, true);
  if (citation) citation += ', ';
  
  if (data.title) {
    citation += `'${data.title}'${data.title.endsWith('?') ? '' : ','} `;
    citation += `in <em>Halsbury's Laws of England</em>`;
  } else {
    citation += `in <em>Halsbury's Laws of England</em>`;
  }
  
  if (data.edition) citation += `, ${data.edition}`;
  if (data.volume) citation += `, vol ${data.volume}`;
  if (data.year) citation += ` (${data.year})`;
  if (data.paragraph) citation += `, para ${data.paragraph}`;
  
  // Add online source information if applicable
  if (data.isOnlineSource && data.websiteUrl) {
    citation += ` <${data.websiteUrl}>`;
    if (data.accessDate) citation += ` accessed ${data.accessDate}`;
  }
  
  return citation;
}

// Main generation function that dispatches to the appropriate formatter
export function generateCitation(data: any, citationType: 'footnote' | 'bibliography' = 'footnote'): string {
  const isFootnote = citationType === 'footnote';
  
  switch (data.sourceType) {
    case 'book':
      return isFootnote 
        ? formatBookCitation(data as BookFormData) 
        : formatBookBibliography(data as BookFormData);
        
    case 'bookChapter':
      return isFootnote 
        ? formatBookChapterCitation(data as BookChapterFormData) 
        : formatBookChapterBibliography(data as BookChapterFormData);
        
    case 'journalArticle':
      return isFootnote 
        ? formatJournalCitation(data as JournalArticleFormData) 
        : formatJournalBibliography(data as JournalArticleFormData);
        
    case 'case':
      return isFootnote 
        ? formatCaseCitation(data as CaseFormData) 
        : formatCaseBibliography(data as CaseFormData);
        
    case 'statute':
      return isFootnote 
        ? formatStatuteCitation(data as StatuteFormData) 
        : formatStatuteBibliography(data as StatuteFormData);
        
    case 'thesis':
      return isFootnote 
        ? formatThesisCitation(data as ThesisFormData) 
        : formatThesisBibliography(data as ThesisFormData);
        
    case 'webResource':
      return isFootnote 
        ? formatWebResourceCitation(data as WebResourceFormData) 
        : formatWebResourceBibliography(data as WebResourceFormData);
        
    case 'newspaper':
      return isFootnote 
        ? formatNewspaperCitation(data as NewspaperFormData) 
        : formatNewspaperBibliography(data as NewspaperFormData);
    
    case 'conferencePaper':
      return isFootnote
        ? formatConferencePaperCitation(data as ConferencePaperFormData)
        : formatConferencePaperBibliography(data as ConferencePaperFormData);
    
    case 'lecture':
      return isFootnote
        ? formatLectureCitation(data as LectureFormData)
        : formatLectureBibliography(data as LectureFormData);
    
    case 'encyclopedia':
      return isFootnote
        ? formatEncyclopediaCitation(data as EncyclopediaFormData)
        : formatEncyclopediaBibliography(data as EncyclopediaFormData);
        
    default:
      return 'Invalid source type';
  }
}