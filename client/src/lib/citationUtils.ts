import { SourceType } from './types';
import { CitationFormatterFactory } from './citationFormatters';

/**
 * Main function to generate citation based on source type
 * Uses the factory pattern to create the appropriate formatter
 */
export function generateCitation(fields: any): string {
  try {
    console.log("generateCitation called with fields:", fields);
    
    // Check if sourceType is present
    if (!fields.sourceType) {
      console.error("No source type specified in fields");
      return "Error: No source type specified";
    }
    
    // Get the appropriate formatter based on the source type
    console.log("Getting formatter for source type:", fields.sourceType);
    const formatter = CitationFormatterFactory.getFormatter(fields.sourceType as SourceType);
    
    // Format the citation
    console.log("Calling formatter.format with fields");
    const result = formatter.format(fields);
    console.log("Formatter returned result:", result);
    
    return result;
  } catch (error) {
    console.error("Citation generation error:", error);
    return `Error generating citation: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Re-export formatters from citationFormatters.ts
export * from './citationFormatters';