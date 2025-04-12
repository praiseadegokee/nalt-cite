import { SourceType } from './types';
import { CitationFormatterFactory } from './citationFormatters';

/**
 * Main function to generate citation based on source type
 * Uses the factory pattern to create the appropriate formatter
 */
export function generateCitation(fields: any): string {
  try {
    // Check if sourceType is present
    if (!fields.sourceType) {
      return "Error: No source type specified";
    }
    
    // Get the appropriate formatter based on the source type
    const formatter = CitationFormatterFactory.getFormatter(fields.sourceType as SourceType);
    
    // Format the citation
    return formatter.format(fields);
  } catch (error) {
    console.error("Citation generation error:", error);
    return `Error generating citation: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Re-export formatters from citationFormatters.ts
export * from './citationFormatters';