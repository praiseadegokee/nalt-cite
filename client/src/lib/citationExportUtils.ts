/**
 * Utility functions for exporting citations in different formats
 */

/**
 * Extracts plain text from an HTML formatted citation by removing all HTML tags
 */
export function getPlainTextCitation(citation: string): string {
  if (!citation) return '';
  return citation
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Formats the citation for clipboard copy
 */
export function formatCitationForClipboard(citation: string): string {
  return getPlainTextCitation(citation);
}

/**
 * Copies citation to clipboard with HTML fallback
 */
export async function copyCitationToClipboard(citationHtml: string): Promise<boolean> {
  try {
    const plainText = getPlainTextCitation(citationHtml);
    
    // Copy HTML + plain text if modern ClipboardItem API is available
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([citationHtml], { type: 'text/html' });
      const item = new ClipboardItem({
        'text/plain': textBlob,
        'text/html': htmlBlob,
      });
      await navigator.clipboard.write([item]);
      return true;
    }
    
    // Fallback to text
    await navigator.clipboard.writeText(plainText);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    try {
      const plainText = getPlainTextCitation(citationHtml);
      await navigator.clipboard.writeText(plainText);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Generates and downloads a text file with the citation
 */
export function downloadCitationAsText(citation: string, filename = 'citation.txt'): void {
  const plainTextCitation = getPlainTextCitation(citation);
  const blob = new Blob([plainTextCitation], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export citation in Word HTML document format (opens natively in Microsoft Word with full italics preserved)
 */
export function exportToWord(citationHtml: string, title = 'NALT Citation'): void {
  const plainText = getPlainTextCitation(citationHtml);
  
  // Format as Microsoft Word compatible HTML with proper styling and headers
  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          margin: 1in;
        }
        .citation {
          padding: 8pt 0;
          text-indent: -0.5in;
          margin-left: 0.5in;
        }
      </style>
    </head>
    <body>
      <div class="citation">
        ${citationHtml}
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nalt-citation.doc';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a BibTeX file (.bib)
 */
export function downloadBibTeX(bibtexString: string, filename = 'citation.bib'): void {
  const blob = new Blob([bibtexString], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
