import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ParsedCitation {
  sourceType: 'case' | 'statute' | 'journal' | 'book' | 'chapter' | 'thesis' | 'website' | 'report' | 'unknown';
  authors?: string[];
  title?: string;
  year?: string;
  volume?: string;
  journal?: string;
  pages?: string;
  court?: string;
  jurisdiction?: string;
  publisher?: string;
  edition?: string;
  chapter?: string;
  editor?: string;
  url?: string;
  accessDate?: string;
  caseNumber?: string;
  statute?: string;
  section?: string;
  confidence: number;
}

export class CitationParserService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.isConfigured && this.model) return;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        this.model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        this.isConfigured = true;
      }
    } catch (error) {
      console.warn('Citation Parser Service: Gemini API not configured:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async parseAndFormatCitation(userInput: string): Promise<{ citation: string; type: string; details: ParsedCitation }> {
    this.ensureInitialized();
    if (!this.isConfigured) {
      throw new Error('AI service not configured for citation parsing');
    }

    const parsePrompt = `You are a specialized legal citation parser for Nigerian legal citation standards (NALT). 

Analyze the following text and extract citation details, then format it according to NALT citation style.

Input text: "${userInput}"

First, determine the source type and extract all available details. Then format according to NALT rules:

NALT Citation Rules:
- Cases: Party Names v Party Names [Year] Court Abbreviation Page/Paragraph
- Statutes: Short Title Year, section number
- Journal Articles: Author, 'Article Title' [Year] Volume Journal Abbreviation Page
- Books: Author, Book Title (Publisher, Year) Page
- Book Chapters: Author, 'Chapter Title' in Editor (ed), Book Title (Publisher, Year) Page

Respond in JSON format:
{
  "sourceType": "case|statute|journal|book|chapter|thesis|website|report",
  "extractedDetails": {
    "authors": ["author1", "author2"],
    "title": "title",
    "year": "year",
    "volume": "volume",
    "journal": "journal name",
    "pages": "page numbers",
    "court": "court name",
    "jurisdiction": "jurisdiction",
    "publisher": "publisher",
    "edition": "edition",
    "caseNumber": "case number",
    "statute": "statute name",
    "section": "section number"
  },
  "formattedCitation": "Complete NALT formatted citation",
  "confidence": 0.9,
  "explanation": "Brief explanation of how the citation was formatted"
}

If you cannot determine enough details, ask for the missing information.`;

    try {
      const result = await this.model.generateContent(parsePrompt);
      const response = result.response.text();
      
      // Parse the JSON response
      let parsed: any;
      try {
        parsed = JSON.parse(response);
      } catch {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid response format from AI');
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
      
      return {
        citation: parsed.formattedCitation,
        type: parsed.sourceType,
        details: {
          sourceType: parsed.sourceType,
          ...parsed.extractedDetails,
          confidence: parsed.confidence
        }
      };
    } catch (error) {
      console.error('Error parsing citation:', error);
      throw new Error('Failed to parse citation details');
    }
  }

  async detectCitationIntent(message: string): Promise<boolean> {
    const citationKeywords = [
      'cite', 'citation', 'reference', 'format',
      'article', 'journal', 'case', 'statute',
      'book', 'chapter', 'thesis', 'report',
      'author', 'title', 'year', 'volume',
      'page', 'court', 'v.', 'vs.', 'versus'
    ];

    const lowercaseMessage = message.toLowerCase();
    
    // Simple keyword detection
    const keywordCount = citationKeywords.filter(keyword => 
      lowercaseMessage.includes(keyword)
    ).length;

    // Also check for patterns that indicate citation requests
    const citationPatterns = [
      /help\s+me\s+cite/i,
      /how\s+to\s+cite/i,
      /citation\s+for/i,
      /format\s+this/i,
      /reference\s+this/i,
      /\d{4}.*volume/i,
      /v\.?\s+\w+/i, // case name pattern
      /\[\d{4}\]/i, // year in brackets
    ];

    const hasPattern = citationPatterns.some(pattern => pattern.test(message));

    return keywordCount >= 2 || hasPattern;
  }

  generateCitationTemplate(sourceType: string): string {
    const templates = {
      case: `To cite a Nigerian court case in NALT format, I need:
- Party names (e.g., "Plaintiff v Defendant")
- Year of decision
- Court abbreviation
- Case number or citation reference
- Page/paragraph number (if pinpointing)

Example: Smith v Jones [2023] NSCCA 45`,

      statute: `To cite a Nigerian statute in NALT format, I need:
- Full title of the Act
- Year of enactment
- Section number (if citing specific section)

Example: Constitution of the Federal Republic of Nigeria 1999, s 36`,

      journal: `To cite a journal article in NALT format, I need:
- Author name(s)
- Article title (in quotes)
- Year of publication
- Volume number
- Journal name/abbreviation
- Starting page number

Example: A.B. Mahmud, 'Constitutional Law in Nigeria' [2023] 15 Nigerian Law Review 45`,

      book: `To cite a book in NALT format, I need:
- Author name(s)
- Book title
- Publisher name
- Year of publication
- Page number (if pinpointing)

Example: F.A. Okonkwo, Nigerian Criminal Law (Sweet & Maxwell, 2023) 156`,

      chapter: `To cite a book chapter in NALT format, I need:
- Chapter author name
- Chapter title (in quotes)
- Editor name
- Book title
- Publisher name
- Year of publication
- Page numbers

Example: C.D. Agomo, 'Land Law Principles' in E.F. Belgore (ed), Nigerian Property Law (University Press, 2023) 78-95`
    };

    return templates[sourceType as keyof typeof templates] || 
           `I can help you format citations for cases, statutes, journal articles, books, and book chapters according to NALT citation style. What type of source would you like to cite?`;
  }
}

export const citationParserService = new CitationParserService();