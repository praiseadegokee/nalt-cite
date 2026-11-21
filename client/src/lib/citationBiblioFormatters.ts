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
import { generateCitation } from './citationUtils';

/**
 * Format author names for Bibliography according to NALT rules:
 * First author: Surname FIRST, followed by initials (e.g. "Adewale, O. A.")
 * Subsequent authors: Standard order initials + surname (e.g. "and J. B. Smith")
 * No terminal full stop in NALT style unless part of an abbreviation.
 */
export function formatBibliographyAuthor(author: Author, isFirstAuthor: boolean = false): string {
  if (author.isOrganization) {
    return author.lastName;
  }

  const initials = [author.firstName?.charAt(0), author.middleName?.charAt(0)]
    .filter(Boolean)
    .map(i => `${i}.`)
    .join(' ');

  if (isFirstAuthor) {
    return initials ? `${author.lastName}, ${initials}` : author.lastName;
  } else {
    return initials ? `${initials} ${author.lastName}` : author.lastName;
  }
}

export function formatBibliographyAuthors(authors: Author[] = []): string {
  if (!authors || authors.length === 0) {
    return '';
  }

  if (authors.length === 1) {
    return formatBibliographyAuthor(authors[0], true);
  }

  if (authors.length === 2) {
    return `${formatBibliographyAuthor(authors[0], true)} and ${formatBibliographyAuthor(authors[1], false)}`;
  }

  const first = formatBibliographyAuthor(authors[0], true);
  const middle = authors.slice(1, -1).map(a => formatBibliographyAuthor(a, false));
  const last = formatBibliographyAuthor(authors[authors.length - 1], false);

  if (middle.length > 0) {
    return `${first}, ${middle.join(', ')} and ${last}`;
  }
  return `${first} and ${last}`;
}

/**
 * Generate NALT-compliant Bibliography format for any source.
 * In NALT & OSCOLA:
 * - Authors in bibliographies invert the primary author's surname: "Surname, F. M."
 * - Cases and Statutes are listed without footnote pinpoint page numbers.
 * - Books and journals omit specific cited page numbers, retaining full publication data or page ranges.
 */
export function generateBibliography(fields: any): string {
  if (!fields || !fields.sourceType) return '';

  const type = fields.sourceType as SourceType;

  switch (type) {
    case 'book': {
      const authorStr = formatBibliographyAuthors(fields.authors);
      let res = authorStr ? `${authorStr}, ` : '';
      res += `<i>${fields.title || ''}</i>`;
      if (fields.edition) {
        res += ` (${fields.edition}, ${fields.publisher || ''} ${fields.year || ''})`;
      } else if (fields.publisher || fields.year) {
        res += ` (${fields.publisher || ''} ${fields.year || ''})`;
      }
      if (fields.isOnlineSource && fields.webAddress) {
        res += ` &lt;${fields.webAddress}&gt;`;
        if (fields.accessDate) res += ` accessed ${fields.accessDate}`;
      }
      return res;
    }

    case 'bookChapter': {
      const authorStr = formatBibliographyAuthors(fields.authors);
      let res = authorStr ? `${authorStr}, ` : '';
      res += `'${fields.chapterTitle || ''}' in `;
      const edInitials = fields.editorFirstName?.charAt(0) ? `${fields.editorFirstName.charAt(0)}.` : '';
      res += `${edInitials} ${fields.editorLastName || ''} (ed), `;
      res += `<i>${fields.bookTitle || ''}</i>`;
      res += ` (${fields.publisher || ''} ${fields.year || ''})`;
      if (fields.pageRange) res += ` ${fields.pageRange}`;
      return res;
    }

    case 'journalArticle': {
      const authorStr = formatBibliographyAuthors(fields.authors);
      let res = authorStr ? `${authorStr}, ` : '';
      res += `'${fields.title || ''}'`;
      if (fields.year) res += ` (${fields.year})`;
      if (fields.volume) res += ` ${fields.volume}`;
      if (fields.issue) res += `(${fields.issue})`;
      if (fields.journalTitle) res += ` <i>${fields.journalTitle}</i>`;
      if (fields.startPage && fields.endPage) {
        res += ` ${fields.startPage}-${fields.endPage}`;
      } else if (fields.startPage) {
        res += ` ${fields.startPage}`;
      }
      if (fields.doi) res += `, doi:${fields.doi}`;
      return res;
    }

    case 'case': {
      // In NALT bibliography / table of cases:
      // Case name is italicized; no author inversion
      let res = `<i>${fields.caseName || 'Untitled Case'}</i>`;
      if (fields.caseType === 'reported') {
        if (fields.yearReported) res += ` [${fields.yearReported}]`;
        if (fields.volumeNumber) res += ` ${fields.volumeNumber}`;
        if (fields.lawReportAbbreviation) res += ` ${fields.lawReportAbbreviation}`;
        if (fields.partNumber) res += ` (${fields.partNumber})`;
        if (fields.pageNumber) res += ` ${fields.pageNumber}`;
      } else {
        if (fields.caseNumber) res += ` ${fields.caseNumber}`;
        if (fields.court) res += ` (${fields.court})`;
        if (fields.judgmentDate) res += ` (${fields.judgmentDate})`;
      }
      return res;
    }

    case 'statute': {
      // In NALT table of statutes:
      let res = fields.statuteTitle || '';
      if (fields.year) res += ` ${fields.year}`;
      if (fields.cap) res += `, Cap ${fields.cap}`;
      if (fields.jurisdiction) res += `, ${fields.jurisdiction}`;
      return res;
    }

    default:
      // Fallback with bibliography author inversion if applicable
      if (fields.authors && fields.authors.length > 0) {
        const standard = generateCitation(fields);
        const bibAuthor = formatBibliographyAuthors(fields.authors);
        // Replace initial author string if present
        return standard.replace(/^[^,]+,\s*/, `${bibAuthor}, `);
      }
      return generateCitation(fields);
  }
}

/**
 * Generate clean BibTeX snippet for academic research export
 */
export function generateBibTeX(fields: any): string {
  if (!fields || !fields.sourceType) return '';

  const citeKey = (fields.authors?.[0]?.lastName || fields.caseName?.split(' ')[0] || fields.statuteTitle?.split(' ')[0] || 'citation')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') + (fields.year || fields.yearReported || new Date().getFullYear());

  const typeMap: Record<string, string> = {
    book: 'book',
    bookChapter: 'incollection',
    journalArticle: 'article',
    case: 'misc',
    statute: 'misc',
    onlineSource: 'misc',
    thesis: 'phdthesis',
    conferencePaper: 'inproceedings'
  };

  const bibType = typeMap[fields.sourceType] || 'misc';

  const authorStr = fields.authors 
    ? fields.authors.map((a: Author) => a.isOrganization ? `{${a.lastName}}` : `${a.lastName}, ${a.firstName || ''}`).join(' and ')
    : '';

  const lines = [`@${bibType}{${citeKey},`];

  if (fields.title || fields.statuteTitle) {
    lines.push(`  title = {${fields.title || fields.statuteTitle}},`);
  } else if (fields.caseName) {
    lines.push(`  title = {${fields.caseName}},`);
  }

  if (authorStr) lines.push(`  author = {${authorStr}},`);
  if (fields.year || fields.yearReported) lines.push(`  year = {${fields.year || fields.yearReported}},`);
  if (fields.publisher) lines.push(`  publisher = {${fields.publisher}},`);
  if (fields.journalTitle) lines.push(`  journal = {${fields.journalTitle}},`);
  if (fields.volume || fields.volumeNumber) lines.push(`  volume = {${fields.volume || fields.volumeNumber}},`);
  if (fields.issue) lines.push(`  number = {${fields.issue}},`);
  if (fields.startPage && fields.endPage) {
    lines.push(`  pages = {${fields.startPage}--${fields.endPage}},`);
  } else if (fields.page || fields.pageNumber) {
    lines.push(`  pages = {${fields.page || fields.pageNumber}},`);
  }
  if (fields.webAddress) lines.push(`  url = {${fields.webAddress}},`);
  if (fields.note) lines.push(`  note = {${fields.note}},`);

  lines.push('}');
  return lines.join('\n');
}
