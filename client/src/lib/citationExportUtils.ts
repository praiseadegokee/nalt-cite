/**
 * Utility functions for exporting citations in different formats
 */

/**
 * Extracts plain text from an HTML formatted citation by removing all HTML tags
 */
export function getPlainTextCitation(citation: string): string {
  return citation.replace(/<[^>]*>/g, '');
}

/**
 * Formats the citation for clipboard copy
 */
export function formatCitationForClipboard(citation: string): string {
  return getPlainTextCitation(citation);
}

/**
 * Copies citation to clipboard
 */
export async function copyCitationToClipboard(citation: string): Promise<boolean> {
  try {
    const plainTextCitation = formatCitationForClipboard(citation);
    await navigator.clipboard.writeText(plainTextCitation);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Generates and downloads a text file with the citation
 */
export function downloadCitationAsText(citation: string, filename = 'citation.txt'): void {
  const plainTextCitation = getPlainTextCitation(citation);
  const blob = new Blob([plainTextCitation], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export citation in Word format (simplified version - just downloads as .docx)
 * For a real implementation, libraries like docx would be needed
 */
export function exportToWord(citation: string): void {
  // This is a simple placeholder. A real implementation would use docx library
  // or similar to create a properly formatted Word document
  const plainText = getPlainTextCitation(citation);
  const blob = new Blob([plainText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'citation.docx';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create a citation in APA format (placeholder - would require additional implementation)
 */
export function convertToAPA(citation: string): string {
  // This is a placeholder. A real implementation would convert NALT format to APA
  return `[APA format] ${getPlainTextCitation(citation)}`;
}

/**
 * Create a citation in MLA format (placeholder - would require additional implementation)
 */
export function convertToMLA(citation: string): string {
  // This is a placeholder. A real implementation would convert NALT format to MLA
  return `[MLA format] ${getPlainTextCitation(citation)}`;
}