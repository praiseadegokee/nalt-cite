import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import SourceTypeSelector from '@/components/citation/SourceTypeSelector';
import { generateCitation } from '@/lib/citationUtils';
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
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: undefined,
      authors: [],
      title: "",
      year: "",
      
      // Initialize other fields
      edition: "",
      publisher: "",
      page: "",
      
      multipleEditors: false,
      isOnlineSource: false,
    },
  });

  function onSubmit(data: FormValues) {
    try {
      // Use our citation utility to generate a properly formatted citation
      const formattedCitation = generateCitation(data);
      setCitation(formattedCitation);
    } catch (error) {
      console.error("Citation generation error:", error);
      toast({
        title: "Citation Error",
        description: "There was an error generating your citation. Please check your inputs.",
        variant: "destructive",
      });
    }
  }
  
  const copyToClipboard = () => {
    // Strip HTML tags for clipboard
    const plainTextCitation = citation.replace(/<[^>]*>/g, '');
    
    navigator.clipboard.writeText(plainTextCitation)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Citation has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <section id="generator" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">NALT Citation Generator</h2>
          <p className="text-gray-600 mb-8">Generate properly formatted citations based on the Nigerian Association of Law Teachers Uniform Format and Citation Guide.</p>
          
          {/* Tool interface */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Source Type Selection and Dynamic Form Fields */}
                <SourceTypeSelector />
                
                {/* Generate button */}
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#1B387A] hover:bg-[#294D98] text-white font-bold py-3 px-4 rounded-md shadow transition duration-150"
                  >
                    Generate Citation
                  </Button>
                </div>
              </form>
            </Form>
            
            {/* Result */}
            {citation && (
              <div className="mt-8 p-4 bg-[#C3CDE1]/30 border border-[#C3CDE1] rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Citation:</h3>
                <div 
                  className="p-3 bg-white border border-gray-300 rounded font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: citation }}
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={copyToClipboard}
                    variant="outline" 
                    className="bg-white hover:bg-gray-100 text-[#1B387A] font-medium py-1.5 px-3 rounded border border-gray-300 text-sm flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
