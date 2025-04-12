import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { OnlineSourceCheckbox } from '@/components/citation/OnlineSourceCheckbox';
import { OnlineSourceFields } from '@/components/citation/OnlineSourceFields';
import { SourceFields } from '@/components/citation-generator/SourceFields';
import { generateCitation } from '@/components/citation-generator/CitationFormatters';
import { SourceType } from '@/lib/types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Book, FileText, Gavel, Scroll, GraduationCap, Globe, Newspaper, Plus, Trash2, AlertCircle, HelpCircle, Calendar } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Base author schema for a single author
const authorSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Name is required"),
  isOrganization: z.boolean().optional(),
});

// Base schema with common fields
const baseFormSchema = z.object({
  sourceType: z.string().min(1, "Source type is required"),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
});

// Book schema
const bookSchema = baseFormSchema.extend({
  title: z.string().min(1, "Title is required"),
  edition: z.string().optional(),
  publisher: z.string().min(1, "Publisher is required"),
  year: z.string().min(1, "Year is required"),
  page: z.string().optional(),
  isChapter: z.boolean().optional(),
  chapterTitle: z.string().optional(),
  editorFirstName: z.string().optional(),
  editorLastName: z.string().optional(),
  pageRange: z.string().optional(),
});

// Journal Article schema
const journalArticleSchema = baseFormSchema.extend({
  title: z.string().min(1, "Title is required"),
  journalName: z.string().min(1, "Journal name is required"),
  year: z.string().min(1, "Year is required"),
  volume: z.string().optional(),
  issue: z.string().optional(),
  page: z.string().min(1, "Page number is required"),
});

// Case schema
const caseSchema = z.object({
  sourceType: z.literal('case'),
  plaintiff: z.string().min(1, "Plaintiff is required"),
  defendant: z.string().min(1, "Defendant is required"),
  year: z.string().min(1, "Year is required").optional(),
  volume: z.string().optional(),
  lawReport: z.string().optional(),
  partNumber: z.string().optional(),
  page: z.string().optional(),
  isUnreported: z.boolean().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
  suitNumber: z.string().optional(),
});

// Statute schema
const statuteSchema = z.object({
  sourceType: z.literal('statute'),
  title: z.string().min(1, "Title is required"),
  year: z.string().min(1, "Year is required"),
  actNumber: z.string().optional(),
  chapter: z.string().optional(),
  section: z.string().optional(),
  subsection: z.string().optional(),
  paragraph: z.string().optional(),
  schedule: z.string().optional(),
  orderNumber: z.string().optional(),
  ruleNumber: z.string().optional(),
  alterationInfo: z.string().optional(),
});

// Web Resource schema
const webResourceSchema = baseFormSchema.extend({
  title: z.string().min(1, "Title is required"),
  webAddress: z.string().min(1, "Web address is required"),
  accessDate: z.string().min(1, "Date of access is required"),
  year: z.string().optional(),
  publisher: z.string().optional(),
});

// Newspaper schema
const newspaperSchema = baseFormSchema.extend({
  title: z.string().min(1, "Article title is required"),
  newspaperName: z.string().min(1, "Newspaper name is required"),
  city: z.string().min(1, "City of publication is required"),
  publicationDate: z.string().min(1, "Date of publication is required"),
  page: z.string().optional(),
  isEditorial: z.boolean().optional(),
  webAddress: z.string().optional(),
  accessDate: z.string().optional(),
});

// Thesis schema
const thesisSchema = baseFormSchema.extend({
  title: z.string().min(1, "Title is required"),
  degreeType: z.string().min(1, "Degree type is required"),
  faculty: z.string().min(1, "Faculty is required"),
  university: z.string().min(1, "University is required"),
  year: z.string().min(1, "Year of submission is required"),
});

// Conference Paper schema
const conferencePaperSchema = baseFormSchema.extend({
  title: z.string().min(1, "Paper title is required"),
  proceedingsTitle: z.string().min(1, "Conference proceedings title is required"),
  conferenceName: z.string().min(1, "Conference name is required"),
  conferenceLocation: z.string().min(1, "Conference location is required"),
  conferenceDates: z.string().min(1, "Conference dates are required"),
  page: z.string().optional(),
});

// Lecture schema
const lectureSchema = baseFormSchema.extend({
  title: z.string().min(1, "Lecture title is required"),
  lectureType: z.string().min(1, "Lecture type is required"),
  occasion: z.string().optional(),
  presentationPlace: z.string().min(1, "Presentation place is required"),
  presentationDate: z.string().min(1, "Presentation date is required"),
});

// Encyclopedia schema
const encyclopediaSchema = baseFormSchema.extend({
  title: z.string().min(1, "Encyclopedia title is required"),
  edition: z.string().optional(),
  year: z.string().min(1, "Year of publication is required"),
  volume: z.string().optional(),
  paragraph: z.string().optional(),
});

// Schema for online source fields
const onlineSourceSchema = z.object({

  webAddress: z.string().optional().refine(
    (val) => !val || (val && val.trim().length > 0), 
    { message: "Web address is required for online sources" }
  ),
  accessDate: z.string().optional(),
  accessDay: z.string().optional(),
  accessMonth: z.string().optional(),
  accessYear: z.string().optional(),
});

// Define a simpler schema approach
const formSchema = z.object({
  sourceType: z.string().min(1, "Source type is required"),
  authors: z.array(authorSchema),
  title: z.string().min(1, "Title is required").optional(),
  // Make all other fields optional
  edition: z.string().optional(),
  publisher: z.string().optional(),
  year: z.string().optional(),
  page: z.string().optional(),
  isChapter: z.boolean().optional(),
  chapterTitle: z.string().optional(),
  bookTitle: z.string().optional(),
  editorFirstName: z.string().optional(),
  editorMiddleName: z.string().optional(),
  editorLastName: z.string().optional(),
  secondEditorFirstName: z.string().optional(),
  secondEditorLastName: z.string().optional(),
  multipleEditors: z.boolean().optional(),
  pageRange: z.string().optional(),
  journalName: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  plaintiff: z.string().optional(),
  defendant: z.string().optional(),
  lawReport: z.string().optional(),
  lawReportCustom: z.string().optional(),
  partNumber: z.string().optional(),
  isUnreported: z.boolean().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
  suitNumber: z.string().optional(),
  actNumber: z.string().optional(),
  chapter: z.string().optional(),
  section: z.string().optional(),
  subsection: z.string().optional(),
  paragraph: z.string().optional(),
  schedule: z.string().optional(),
  orderNumber: z.string().optional(),
  ruleNumber: z.string().optional(),
  alterationInfo: z.string().optional(),
  
  // Newspaper fields
  newspaperName: z.string().optional(),
  city: z.string().optional(),
  publicationDate: z.string().optional(),
  isEditorial: z.boolean().optional(),
  
  // Thesis fields
  degreeType: z.string().optional(),
  faculty: z.string().optional(),
  university: z.string().optional(),
  
  // Conference Paper fields
  proceedingsTitle: z.string().optional(),
  conferenceName: z.string().optional(),
  conferenceLocation: z.string().optional(),
  conferenceDates: z.string().optional(),
  
  // Lecture fields
  lectureType: z.string().optional(),
  occasion: z.string().optional(),
  presentationPlace: z.string().optional(),
  presentationDate: z.string().optional(),
  
  // Add all online source fields
  isOnlineSource: z.boolean().optional(),
  webAddress: z.string().optional(),
  accessDate: z.string().optional(),
  accessDay: z.string().optional(),
  accessMonth: z.string().optional(),
  accessYear: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validate authors based on source type
  if (data.sourceType !== 'case' && data.sourceType !== 'statute' && 
      (!data.authors || data.authors.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one author is required",
      path: ["authors"],
    });
  }
  
  // If isOnlineSource is true, webAddress is required
  if (data.isOnlineSource && (!data.webAddress || data.webAddress.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Web address is required for online sources",
      path: ["webAddress"],
    });
  }
  
  // If isOnlineSource is true, ensure at least one form of access date is provided
  if (data.isOnlineSource && 
      !data.accessDate && 
      !(data.accessDay && data.accessMonth && data.accessYear)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Access date is required for online sources",
      path: ["accessDate"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function CitationGenerator() {
  const [citation, setCitation] = useState<string>("");
  const [formattedCitation, setFormattedCitation] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("footnote");
  const [sourceType, setSourceType] = useState<SourceType>('book');
  const { toast } = useToast();

  // Initialize form with default book type
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: 'book',
      authors: [{ firstName: '', lastName: '', middleName: '', isOrganization: false }],
      title: '',
      // Book fields
      edition: '',
      publisher: '',
      year: '',
      page: '',
      // Book chapter fields
      chapterTitle: '',
      bookTitle: '',
      multipleEditors: false,
      editorFirstName: '',
      editorMiddleName: '',
      editorLastName: '',
      secondEditorFirstName: '',
      secondEditorLastName: '',
      pageRange: '',
    } as any,
  });

  // Get the field array for authors
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  // Update sourceType state when form sourceType changes
  const watchSourceType = form.watch("sourceType") as SourceType;
  useEffect(() => {
    if (watchSourceType) {
      setSourceType(watchSourceType);
      
      // Reset form when source type changes but keep the source type
      form.reset({ 
        sourceType: watchSourceType, 
        authors: [{ firstName: '', lastName: '', middleName: '', isOrganization: false }],
        // Reset all fields
        title: '',
        // Book fields
        edition: '',
        publisher: '',
        year: '',
        page: '',
        // Book chapter fields
        chapterTitle: '',
        bookTitle: '',
        multipleEditors: false,
        editorFirstName: '',
        editorMiddleName: '',
        editorLastName: '',
        secondEditorFirstName: '',
        secondEditorLastName: '',
        pageRange: '',
      } as any);
    }
  }, [watchSourceType, form]);

  function formatAuthor(author: any) {
    if (author.isOrganization) {
      return author.lastName;
    } else {
      let authorString = '';
      if (author.firstName) {
        authorString += `${author.firstName.charAt(0)} `;
      }
      if (author.middleName) {
        authorString += `${author.middleName.charAt(0)} `;
      }
      authorString += author.lastName;
      return authorString.trim();
    }
  }

  function formatAuthors(authors: any[], bibliography = false) {
    if (authors.length === 0) return '';
    
    if (bibliography) {
      // For bibliography, surname comes first
      const formattedAuthors = authors.map(author => {
        if (author.isOrganization) {
          return author.lastName;
        } else {
          let authorString = author.lastName;
          if (author.firstName || author.middleName) {
            authorString += ', ';
            if (author.firstName) {
              authorString += `${author.firstName.charAt(0)}`;
            }
            if (author.middleName) {
              authorString += ` ${author.middleName.charAt(0)}`;
            }
          }
          return authorString.trim();
        }
      });
      
      if (formattedAuthors.length === 1) {
        return formattedAuthors[0];
      } else if (formattedAuthors.length === 2) {
        return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
      } else {
        return `${formattedAuthors.slice(0, -1).join(', ')} and ${formattedAuthors[formattedAuthors.length - 1]}`;
      }
    } else {
      // For footnotes, initials come before surname
      const formattedAuthors = authors.map(author => formatAuthor(author));
      
      if (formattedAuthors.length === 1) {
        return formattedAuthors[0];
      } else if (formattedAuthors.length === 2) {
        return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
      } else {
        return `${formattedAuthors.slice(0, -1).join(', ')} and ${formattedAuthors[formattedAuthors.length - 1]}`;
      }
    }
  }

  function onSubmit(data: FormValues) {
    console.log("Form submitted with data:", data);
    
    // Use the citation formatter utility to generate properly formatted citations
    try {
      const footnote = generateCitation(data, 'footnote');
      const bibliography = generateCitation(data, 'bibliography');
      
      console.log("Generated citations:", { footnote, bibliography });
      
      // Set the formatted citations for display
      setCitation(footnote);
      setFormattedCitation(bibliography);
      
      // Show success message
      toast({
        title: "Citation generated successfully",
        description: "Your citation has been generated in both footnote and bibliography formats.",
      });
    } catch (error) {
      console.error("Error generating citation:", error);
      toast({
        title: "Error generating citation",
        description: "There was an error generating your citation. Please check your input.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-[#294D98]">NALT Citation Generator</h1>
      <p className="text-center text-gray-600 mb-6">Generate properly formatted citations for legal sources</p>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Source Type Selection */}
              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Select Source Type</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                          <SelectValue placeholder="Select a source type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="bookChapter">Book Chapter</SelectItem>
                          <SelectItem value="journalArticle">Journal Article</SelectItem>
                          <SelectItem value="case">Case</SelectItem>
                          <SelectItem value="statute">Statute/Legislation</SelectItem>
                          <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                          <SelectItem value="conferencePaper">Conference Paper</SelectItem>
                          <SelectItem value="newspaper">Newspaper/Magazine</SelectItem>
                          <SelectItem value="webResource">Web Resource</SelectItem>
                          <SelectItem value="lecture">Lecture</SelectItem>
                          <SelectItem value="encyclopedia">Encyclopedia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose the type of source you want to cite
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Author Information - hidden for Case and Statute */}
              {sourceType !== 'case' && sourceType !== 'statute' && (
                <>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-4">Author Information</h3>
                    
                    {fields.map((field, index) => (
                      <div key={field.id} className="mb-4 bg-white p-4 rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-medium">Author {index + 1}</h4>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              className="h-8 px-2 text-red-500"
                              onClick={() => remove(index)}
                              type="button"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`authors.${index}.isOrganization`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mb-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                This is an organization or institution
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch(`authors.${index}.isOrganization`) ? (
                          <FormField
                            control={form.control}
                            name={`authors.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Organization Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., National Judicial Institute" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`authors.${index}.firstName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., David" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`authors.${index}.middleName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Middle Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Ezeani" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`authors.${index}.lastName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Achebe" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => append({ firstName: '', lastName: '', middleName: '', isOrganization: false })}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Author
                    </Button>
                  </div>
                </>
              )}
              
              {/* Source-specific fields */}
              <SourceFields 
                sourceType={sourceType as SourceType} 
                control={form.control} 
                watch={form.watch} 
                setValue={form.setValue} 
              />
              
              <Button 
                type="submit" 
                className="w-full bg-[#294D98] hover:bg-[#3A64BB] text-white"
              >
                Generate Citation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Display the citation result */}
      {(citation || formattedCitation) && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#294D98]">Generated Citation</h2>
            
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="footnote" className="flex-1">Footnote</TabsTrigger>
                <TabsTrigger value="bibliography" className="flex-1">Bibliography</TabsTrigger>
              </TabsList>
              
              <TabsContent value="footnote" className="mt-4">
                <div className="bg-gray-50 p-4 rounded-md relative">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: citation }} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      navigator.clipboard.writeText(citation.replace(/<\/?[^>]+(>|$)/g, ""));
                      toast({
                        title: "Copied to clipboard",
                        description: "The footnote citation has been copied to your clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="bibliography" className="mt-4">
                <div className="bg-gray-50 p-4 rounded-md relative">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formattedCitation }} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      navigator.clipboard.writeText(formattedCitation.replace(/<\/?[^>]+(>|$)/g, ""));
                      toast({
                        title: "Copied to clipboard",
                        description: "The bibliography citation has been copied to your clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Educational guidance */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-[#294D98]">
            <HelpCircle className="mr-2 h-5 w-5" />
            Citation Guide
          </h2>
          <p className="text-gray-600 mb-4">
            This tool helps you generate citations according to Nigerian legal writing standards. Different source types have specific citation formats:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>Books:</strong> Author, <i>Title</i> (Edition, Publisher Year) Page</li>
            <li><strong>Journal Articles:</strong> Author, 'Title' (Year) Volume <i>Journal Name</i> (Issue) Page</li>
            <li><strong>Cases:</strong> <i>Plaintiff v Defendant</i> [Year] Volume Law Report Page</li>
            <li><strong>Statutes:</strong> Title Year, Section</li>
            <li><strong>Web Resources:</strong> Author, 'Title' (Publisher Year) &lt;URL&gt; accessed Date</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}