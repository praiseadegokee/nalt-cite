import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Author, SourceType } from '@/lib/types';

// Define base form schema with Zod
const formSchema = z.object({
  sourceType: z.enum([
    'case', 
    'statute', 
    'book', 
    'bookChapter', 
    'journalArticle', 
    'onlineSource', 
    'conferencePaper',
    'newspaper',
    'thesis',
    'lecture',
    'encyclopedia',
    'monograph',
    'lectureNote'
  ] as const),
  
  // Common fields that most sources will have
  title: z.string().optional(),
  year: z.string().optional(),
  
  // Author fields
  authors: z.array(
    z.object({
      firstName: z.string().optional(),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Last name or organization name is required"),
      isOrganization: z.boolean().optional(),
    })
  ).optional(),
  
  // Book specific fields
  edition: z.string().optional(),
  publisher: z.string().optional(),
  page: z.string().optional(),
  
  // Book chapter specific fields
  bookTitle: z.string().optional(),
  chapterTitle: z.string().optional(),
  editorFirstName: z.string().optional(),
  editorMiddleName: z.string().optional(),
  editorLastName: z.string().optional(),
  secondEditorFirstName: z.string().optional(),
  secondEditorLastName: z.string().optional(),
  multipleEditors: z.boolean().optional(),
  pageRange: z.string().optional(),
  
  // Journal article specific fields
  journalTitle: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  startPage: z.string().optional(),
  endPage: z.string().optional(),
  doi: z.string().optional(),
  
  // Case specific fields
  caseType: z.enum(['reported', 'unreported']),
  caseName: z.string().min(1, "Case name is required"),
  parties: z.array(
    z.object({
      role: z.string().min(1, "Party role is required"),
      name: z.string().min(1, "Party name is required")
    })
  ).min(2, "At least two parties are required"),
  
  // Reported case fields
  yearReported: z.string().optional()
    .refine(val => val === undefined || val === "" || /^\d{4}$/.test(val), {
      message: "Year must be a 4-digit number"
    }),
  volumeNumber: z.string().optional(),
  partNumber: z.string().optional(),
  lawReportAbbreviation: z.string().optional(),
  pageNumber: z.string().optional(),
  
  // Unreported case fields
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
  isUnreportedSimple: z.boolean().default(false),
  
  // Statute specific fields
  statuteTitle: z.string().optional(),
  jurisdiction: z.string().optional(),
  section: z.string().optional(),
  cap: z.string().optional(),
  
  // Online source specific fields
  websiteTitle: z.string().optional(),
  url: z.string().optional(),
  accessDate: z.string().optional(),
  isOnlineSource: z.boolean().optional(),
  webAddress: z.string().optional(),
  
  // Date related fields for access dates
  accessDateDay: z.string().optional(),
  accessDateMonth: z.string().optional(),
  accessDateYear: z.string().optional(),
  
  // Conference paper specific fields
  conferenceName: z.string().optional(),
  conferenceLocation: z.string().optional(),
  conferenceDate: z.string().optional(),
  
  // Newspaper specific fields
  newspaperTitle: z.string().optional(),
  date: z.string().optional(),
  
  // Thesis specific fields
  thesisType: z.string().optional(),
  institution: z.string().optional(),
  
  // Lecture specific fields
  lectureType: z.string().optional(),
  location: z.string().optional(),
  
  // Encyclopedia specific fields
  encyclopediaTitle: z.string().optional(),
  
  // Monograph specific fields
  series: z.string().optional(),
  
  // Lecture note specific fields
  course: z.string().optional(),
  audience: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Add custom validation for conditional case fields
const caseFormSchema = formSchema.refine(
  (data) => {
    // Skip validation if not a case citation
    if (data.sourceType !== 'case') return true;
    
    // For reported cases
    if (data.caseType === 'reported') {
      const hasYearReported = !!data.yearReported;
      const hasLawReportAbbreviation = !!data.lawReportAbbreviation;
      
      if (!hasYearReported || !hasLawReportAbbreviation) {
        return false;
      }
    }
    
    // For unreported cases (not using simple format)
    if (data.caseType === 'unreported' && !data.isUnreportedSimple) {
      const hasCaseNumber = !!data.caseNumber;
      const hasCourt = !!data.court;
      
      if (!hasCaseNumber || !hasCourt) {
        return false;
      }
    }
    
    return true;
  },
  {
    message: "Missing required fields for the selected case type",
    path: ["caseType"], // Show error on the case type field
  }
);

export type CitationFormValues = z.infer<typeof formSchema>;

export function useCitationForm() {
  const form = useForm<CitationFormValues>({
    resolver: zodResolver(caseFormSchema),
    mode: "onSubmit", // Only validate on submit to prevent premature validation errors
    defaultValues: {
      sourceType: "case", // Set a default source type to avoid undefined issues
      authors: [],
      title: "",
      year: "",
      
      // Common fields
      edition: "",
      publisher: "",
      page: "",
      
      // Toggle fields
      multipleEditors: false,
      isOnlineSource: false,
      
      // Online access fields
      webAddress: "",
      accessDate: "",
      
      // Date related fields
      accessDateDay: new Date().getDate().toString(),
      accessDateMonth: (new Date().getMonth() + 1).toString(),
      accessDateYear: new Date().getFullYear().toString(),
      
      // Case fields
      caseType: "reported",
      caseName: "",
      parties: [
        { role: "Plaintiff", name: "" },
        { role: "Defendant", name: "" }
      ], // Initialize with two parties to satisfy validation
      yearReported: "",
      volumeNumber: "",
      partNumber: "",
      lawReportAbbreviation: "",
      pageNumber: "",
      caseNumber: "",
      court: "",
      judgmentDate: "",
      isUnreportedSimple: false,
      
      // Statute fields
      statuteTitle: "",
      jurisdiction: "",
      section: "",
      cap: "",
      
      // Book chapter fields
      bookTitle: "",
      chapterTitle: "",
      editorFirstName: "",
      editorMiddleName: "",
      editorLastName: "",
      secondEditorFirstName: "",
      secondEditorLastName: "",
      pageRange: "",
      
      // Journal article fields
      journalTitle: "",
      volume: "",
      issue: "",
      startPage: "",
      endPage: "",
      doi: "",
      
      // Online source fields
      websiteTitle: "",
      url: "",
      
      // Conference paper fields
      conferenceName: "",
      conferenceLocation: "",
      conferenceDate: "",
      
      // Newspaper fields
      newspaperTitle: "",
      date: "",
      
      // Thesis fields
      thesisType: "",
      institution: "",
      
      // Lecture fields
      lectureType: "",
      location: "",
      
      // Encyclopedia fields
      encyclopediaTitle: "",
      
      // Monograph fields
      series: "",
      
      // Lecture note fields
      course: "",
      audience: "",
      additionalInfo: "",
    },
  });

  return form;
}

export { formSchema };