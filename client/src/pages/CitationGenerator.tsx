import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { generateCitation } from '@/lib/citationUtils';
import { Author, SourceType } from '@/lib/types';
import CitationFormContainer from '@/components/citation/CitationFormContainer';
import CitationResult from '@/components/citation/CitationResult';

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
  caseName: z.string().optional(),
  citation: z.string().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
  
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

type FormValues = z.infer<typeof formSchema>;

export default function CitationGenerator() {
  const [citation, setCitation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: undefined,
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
      accessDateDay: "",
      accessDateMonth: "",
      accessDateYear: "",
      
      // Case fields
      caseName: "",
      citation: "",
      court: "",
      judgmentDate: "",
      
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

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      
      // Simulate some processing time
      await new Promise(r => setTimeout(r, 500));
      
      // Debug: log form data to check online fields
      console.log("Form Data:", JSON.stringify(data, null, 2));
      
      // Use our citation utility to generate a properly formatted citation
      const formattedCitation = generateCitation(data);
      setCitation(formattedCitation);
      
      // Show success message
      toast({
        title: "Citation Generated",
        description: "Your citation has been successfully generated.",
      });
    } catch (error) {
      console.error("Citation generation error:", error);
      toast({
        title: "Citation Error",
        description: "There was an error generating your citation. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="generator" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">NALT Citation Generator</h2>
            <p className="text-gray-600">Generate properly formatted citations based on the Nigerian Association of Law Teachers Uniform Format and Citation Guide.</p>
          </div>
          
          {/* Citation Form */}
          <CitationFormContainer 
            form={form} 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
          />
          
          {/* Citation Result */}
          {citation && <CitationResult citation={citation} />}
        </div>
      </div>
    </section>
  );
}
