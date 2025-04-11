import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Copy, Book, FileText, Gavel, Scroll, GraduationCap, Globe, Newspaper, Plus, Trash2, AlertCircle, HelpCircle } from 'lucide-react';

// Base author schema for a single author
const authorSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
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
const caseSchema = baseFormSchema.extend({
  plaintiff: z.string().min(1, "Plaintiff is required"),
  defendant: z.string().min(1, "Defendant is required"),
  year: z.string().min(1, "Year is required"),
  volume: z.string().optional(),
  lawReport: z.string().min(1, "Law report is required"),
  partNumber: z.string().optional(),
  page: z.string().min(1, "Page number is required"),
  isUnreported: z.boolean().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
});

// Statute schema
const statuteSchema = baseFormSchema.extend({
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

// Define a simpler schema approach
const formSchema = z.object({
  sourceType: z.string().min(1, "Source type is required"),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
  title: z.string().min(1, "Title is required").optional(),
  // Make all other fields optional
  edition: z.string().optional(),
  publisher: z.string().optional(),
  year: z.string().optional(),
  page: z.string().optional(),
  isChapter: z.boolean().optional(),
  chapterTitle: z.string().optional(),
  editorFirstName: z.string().optional(),
  editorLastName: z.string().optional(),
  pageRange: z.string().optional(),
  journalName: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  plaintiff: z.string().optional(),
  defendant: z.string().optional(),
  lawReport: z.string().optional(),
  partNumber: z.string().optional(),
  isUnreported: z.boolean().optional(),
  court: z.string().optional(),
  judgmentDate: z.string().optional(),
  actNumber: z.string().optional(),
  chapter: z.string().optional(),
  section: z.string().optional(),
  subsection: z.string().optional(),
  paragraph: z.string().optional(),
  schedule: z.string().optional(),
  orderNumber: z.string().optional(),
  ruleNumber: z.string().optional(),
  alterationInfo: z.string().optional(),
  webAddress: z.string().optional(),
  accessDate: z.string().optional(),
  newspaperName: z.string().optional(),
  city: z.string().optional(),
  publicationDate: z.string().optional(),
  isEditorial: z.boolean().optional(),
  degreeType: z.string().optional(),
  faculty: z.string().optional(),
  university: z.string().optional(),
  proceedingsTitle: z.string().optional(),
  conferenceName: z.string().optional(),
  conferenceLocation: z.string().optional(),
  conferenceDates: z.string().optional(),
  lectureType: z.string().optional(),
  occasion: z.string().optional(),
  presentationPlace: z.string().optional(),
  presentationDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CitationGenerator() {
  const [citation, setCitation] = useState<string>("");
  const [formattedCitation, setFormattedCitation] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("footnote");
  const [sourceType, setSourceType] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with default book type
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: 'book',
      authors: [{ firstName: '', lastName: '', middleName: '', isOrganization: false }],
      title: '',
    } as any,
  });

  // Get the field array for authors
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  // Update sourceType state when form sourceType changes
  const watchSourceType = form.watch("sourceType");
  useEffect(() => {
    if (watchSourceType) {
      setSourceType(watchSourceType);
      
      // Reset form when source type changes but keep the source type
      form.reset({ 
        sourceType: watchSourceType, 
        authors: [{ firstName: '', lastName: '', middleName: '', isOrganization: false }],
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
    let formattedCitation = "";
    let bibCitation = "";
    
    // Format based on source type
    switch(data.sourceType) {
      case 'book':
        if (data.isChapter) {
          // Format for book chapter
          formattedCitation = `${formatAuthors(data.authors)}, '${data.chapterTitle}' in `;
          
          // Add editor if available
          if (data.editorFirstName || data.editorLastName) {
            const editorInitial = data.editorFirstName ? data.editorFirstName.charAt(0) : '';
            formattedCitation += `${editorInitial} ${data.editorLastName} (ed), `;
          }
          
          formattedCitation += `<i>${data.title}</i>`;
          
          if (data.edition) {
            formattedCitation += ` (${data.edition}, ${data.publisher} ${data.year})`;
          } else {
            formattedCitation += ` (${data.publisher} ${data.year})`;
          }
          
          if (data.pageRange) {
            formattedCitation += ` ${data.pageRange}`;
          }
          
          // Bibliography format
          bibCitation = `${formatAuthors(data.authors, true)}, '${data.chapterTitle}' in `;
          if (data.editorFirstName || data.editorLastName) {
            const editorInitial = data.editorFirstName ? data.editorFirstName.charAt(0) : '';
            bibCitation += `${data.editorLastName}, ${editorInitial} (ed), `;
          }
          bibCitation += `<i>${data.title}</i>`;
          if (data.edition) {
            bibCitation += ` (${data.edition}, ${data.publisher} ${data.year})`;
          } else {
            bibCitation += ` (${data.publisher} ${data.year})`;
          }
        } else {
          // Format for standard book
          formattedCitation = `${formatAuthors(data.authors)}, <i>${data.title}</i>`;
          
          if (data.edition) {
            formattedCitation += ` (${data.edition}, ${data.publisher} ${data.year})`;
          } else {
            formattedCitation += ` (${data.publisher} ${data.year})`;
          }
          
          if (data.page) {
            formattedCitation += ` ${data.page}`;
          }
          
          // Bibliography format
          bibCitation = `${formatAuthors(data.authors, true)}, <i>${data.title}</i>`;
          if (data.edition) {
            bibCitation += ` (${data.edition}, ${data.publisher} ${data.year})`;
          } else {
            bibCitation += ` (${data.publisher} ${data.year})`;
          }
        }
        break;
        
      case 'journalArticle':
        formattedCitation = `${formatAuthors(data.authors)}, '${data.title}' (${data.year})`;
        
        if (data.volume) {
          formattedCitation += ` ${data.volume}`;
        }
        
        formattedCitation += ` <i>${data.journalName}</i>`;
        
        if (data.issue) {
          formattedCitation += ` (${data.issue})`;
        }
        
        formattedCitation += ` ${data.page}`;
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, '${data.title}' (${data.year})`;
        if (data.volume) {
          bibCitation += ` ${data.volume}`;
        }
        bibCitation += ` <i>${data.journalName}</i>`;
        if (data.issue) {
          bibCitation += ` (${data.issue})`;
        }
        bibCitation += ` ${data.page}`;
        break;
        
      case 'case':
        if (data.isUnreported) {
          formattedCitation = `<i>${data.plaintiff} v ${data.defendant}</i> (Unreported) ${data.court}, ${data.judgmentDate}`;
          bibCitation = formattedCitation;
        } else {
          formattedCitation = `<i>${data.plaintiff} v ${data.defendant}</i> [${data.year}]`;
          
          if (data.volume) {
            formattedCitation += ` ${data.volume}`;
          }
          
          formattedCitation += ` ${data.lawReport}`;
          
          if (data.partNumber) {
            formattedCitation += ` (Pt ${data.partNumber})`;
          }
          
          formattedCitation += ` ${data.page}`;
          
          // Bibliography format - same as footnote for cases
          bibCitation = formattedCitation;
        }
        break;
        
      case 'statute':
        formattedCitation = `${data.title} ${data.year}`;
        
        if (data.actNumber) {
          formattedCitation += `, Act No ${data.actNumber}`;
        }
        
        if (data.chapter) {
          formattedCitation += `, Cap ${data.chapter}`;
        }
        
        if (data.section) {
          formattedCitation += `, s ${data.section}`;
          
          if (data.subsection) {
            formattedCitation += `(${data.subsection})`;
          }
          
          if (data.paragraph) {
            formattedCitation += `(${data.paragraph})`;
          }
        }
        
        if (data.schedule) {
          formattedCitation += `, Schedule ${data.schedule}`;
        }
        
        if (data.orderNumber) {
          formattedCitation += `, Order ${data.orderNumber}`;
        }
        
        if (data.ruleNumber) {
          formattedCitation += `, Rule ${data.ruleNumber}`;
        }
        
        if (data.alterationInfo) {
          formattedCitation += ` (${data.alterationInfo})`;
        }
        
        // Bibliography format - same as footnote for statutes
        bibCitation = formattedCitation;
        break;
        
      case 'webResource':
        formattedCitation = `${formatAuthors(data.authors)}, '${data.title}'`;
        
        if (data.publisher || data.year) {
          formattedCitation += ` (`;
          if (data.publisher) {
            formattedCitation += data.publisher;
            if (data.year) {
              formattedCitation += ` ${data.year}`;
            }
          } else if (data.year) {
            formattedCitation += data.year;
          }
          formattedCitation += `)`;
        }
        
        formattedCitation += ` <${data.webAddress}> accessed ${data.accessDate}`;
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, '${data.title}'`;
        if (data.publisher || data.year) {
          bibCitation += ` (`;
          if (data.publisher) {
            bibCitation += data.publisher;
            if (data.year) {
              bibCitation += ` ${data.year}`;
            }
          } else if (data.year) {
            bibCitation += data.year;
          }
          bibCitation += `)`;
        }
        bibCitation += ` <${data.webAddress}> accessed ${data.accessDate}`;
        break;
        
      case 'newspaper':
        if (data.isEditorial) {
          formattedCitation = `Editorial, '${data.title}' <i>${data.newspaperName}</i> (${data.city}) ${data.publicationDate}`;
          if (data.page) {
            formattedCitation += ` ${data.page}`;
          }
        } else {
          formattedCitation = `${formatAuthors(data.authors)}, '${data.title}' <i>${data.newspaperName}</i> (${data.city}) ${data.publicationDate}`;
          if (data.page) {
            formattedCitation += ` ${data.page}`;
          }
        }
        
        if (data.webAddress && data.accessDate) {
          formattedCitation += ` <${data.webAddress}> accessed ${data.accessDate}`;
        }
        
        // Bibliography format
        if (data.isEditorial) {
          bibCitation = `Editorial, '${data.title}' <i>${data.newspaperName}</i> (${data.city}) ${data.publicationDate}`;
          if (data.page) {
            bibCitation += ` ${data.page}`;
          }
        } else {
          bibCitation = `${formatAuthors(data.authors, true)}, '${data.title}' <i>${data.newspaperName}</i> (${data.city}) ${data.publicationDate}`;
          if (data.page) {
            bibCitation += ` ${data.page}`;
          }
        }
        
        if (data.webAddress && data.accessDate) {
          bibCitation += ` <${data.webAddress}> accessed ${data.accessDate}`;
        }
        break;
        
      case 'thesis':
        formattedCitation = `${formatAuthors(data.authors)}, <i>${data.title}</i> (${data.degreeType}, ${data.faculty}, ${data.university} ${data.year})`;
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, <i>${data.title}</i> (${data.degreeType}, ${data.faculty}, ${data.university} ${data.year})`;
        break;
        
      case 'conferencePaper':
        formattedCitation = `${formatAuthors(data.authors)}, '${data.title}' <i>${data.proceedingsTitle}</i>, ${data.conferenceName}, ${data.conferenceLocation}, ${data.conferenceDates}`;
        
        if (data.page) {
          formattedCitation += ` ${data.page}`;
        }
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, '${data.title}' <i>${data.proceedingsTitle}</i>, ${data.conferenceName}, ${data.conferenceLocation}, ${data.conferenceDates}`;
        
        if (data.page) {
          bibCitation += ` ${data.page}`;
        }
        break;
        
      case 'lecture':
        formattedCitation = `${formatAuthors(data.authors)}, <i>${data.title}</i>, ${data.lectureType}`;
        
        if (data.occasion) {
          formattedCitation += `, ${data.occasion}`;
        }
        
        formattedCitation += `, ${data.presentationPlace}, ${data.presentationDate}`;
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, <i>${data.title}</i>, ${data.lectureType}`;
        
        if (data.occasion) {
          bibCitation += `, ${data.occasion}`;
        }
        
        bibCitation += `, ${data.presentationPlace}, ${data.presentationDate}`;
        break;
        
      case 'encyclopedia':
        formattedCitation = `${formatAuthors(data.authors)}, <i>${data.title}</i>`;
        
        if (data.edition) {
          formattedCitation += ` (${data.edition})`;
        }
        
        formattedCitation += ` (${data.year})`;
        
        if (data.volume) {
          formattedCitation += ` vol ${data.volume}`;
        }
        
        if (data.paragraph) {
          formattedCitation += ` para ${data.paragraph}`;
        }
        
        // Bibliography format
        bibCitation = `${formatAuthors(data.authors, true)}, <i>${data.title}</i>`;
        
        if (data.edition) {
          bibCitation += ` (${data.edition})`;
        }
        
        bibCitation += ` (${data.year})`;
        
        if (data.volume) {
          bibCitation += ` vol ${data.volume}`;
        }
        
        if (data.paragraph) {
          bibCitation += ` para ${data.paragraph}`;
        }
        break;
        
      default:
        formattedCitation = "Source type not supported";
        bibCitation = "Source type not supported";
    }
    
    // Set citation depending on selected tab
    setCitation(selectedTab === "footnote" ? formattedCitation : bibCitation);
    setFormattedCitation(formattedCitation); // Store the footnote citation for reference
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

  // Get source type icon
  const getSourceTypeIcon = () => {
    switch(sourceType) {
      case 'book': return <Book className="h-5 w-5" />;
      case 'journalArticle': return <FileText className="h-5 w-5" />;
      case 'case': return <Gavel className="h-5 w-5" />;
      case 'statute': return <Scroll className="h-5 w-5" />;
      case 'thesis': return <GraduationCap className="h-5 w-5" />;
      case 'webResource': return <Globe className="h-5 w-5" />;
      case 'newspaper': return <Newspaper className="h-5 w-5" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  return (
    <section id="generator" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-3">
            {getSourceTypeIcon()}
            <h2 className="text-2xl md:text-3xl font-bold ml-2 text-[#1B387A]">NALT Citation Generator</h2>
          </div>
          <p className="text-gray-600 mb-8">Generate properly formatted citations based on the Nigerian Association of Law Teachers Uniform Format and Citation Guide.</p>
          
          {/* Tool interface */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Source Type Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1B387A]">Source Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                </div>
                
                <Separator />
                
                {/* Authors Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#1B387A]">Author Information</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ firstName: '', lastName: '', middleName: '', isOrganization: false })}
                      className="flex items-center text-[#1B387A]"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Author
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Author {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-500 p-1 h-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <FormField
                            control={form.control}
                            name={`authors.${index}.isOrganization`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  This is an organization/institution
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {form.watch(`authors.${index}.isOrganization`) ? (
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name={`authors.${index}.lastName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Organization Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Nigerian Association of Law Teachers" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <FormField
                              control={form.control}
                              name={`authors.${index}.firstName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Oluwole" 
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
                                      placeholder="e.g., Akin" 
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
                                      placeholder="e.g., Oyewo" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Separator />
                
                {/* Source-specific fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1B387A]">Source Details</h3>
                  
                  {/* Book specific fields */}
                  {sourceType === 'book' && (
                    <div className="space-y-4">
                      <div className="mb-3">
                        <FormField
                          control={form.control}
                          name="isChapter"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                This is a chapter in an edited book
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("isChapter") ? (
                        <>
                          <FormField
                            control={form.control}
                            name="chapterTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Chapter Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., The Role of Legal Education in Nigeria" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="editorFirstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Editor First Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Emeka" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="editorLastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Editor Last Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., Nweze" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      ) : null}
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              {form.watch("isChapter") ? "Book Title" : "Title"}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Constitutional Law in Nigeria" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="edition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Edition</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2nd edn" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="publisher"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Publisher</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., University Press" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2018" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={form.watch("isChapter") ? "pageRange" : "page"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              {form.watch("isChapter") ? "Page Range" : "Page Number"}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder={form.watch("isChapter") ? "e.g., 120-135" : "e.g., 25"} 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Journal Article specific fields */}
                  {sourceType === 'journalArticle' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Article Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Judicial Activism in Nigerian Courts" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="journalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Journal Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Nigerian Journal of Contemporary Law" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2020" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="volume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Volume</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 5" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="issue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Issue</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="page"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Page Number</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 245" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Case specific fields */}
                  {sourceType === 'case' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="plaintiff"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Plaintiff</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Garba" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="defendant"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Defendant</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., University of Maiduguri" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <FormField
                          control={form.control}
                          name="isUnreported"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                This is an unreported case
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("isUnreported") ? (
                        <>
                          <FormField
                            control={form.control}
                            name="court"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Court</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., Federal High Court Jos Judicial Division" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="judgmentDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Judgment Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., 17 June 2016" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField
                              control={form.control}
                              name="year"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., 1986" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="volume"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Volume</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., 1" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="lawReport"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Law Report</FormLabel>
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                      value={field.value}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a law report" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="NWLR">NWLR</SelectItem>
                                        <SelectItem value="FWLR">FWLR</SelectItem>
                                        <SelectItem value="SCNJ">SCNJ</SelectItem>
                                        <SelectItem value="WRNLR">WRNLR</SelectItem>
                                        <SelectItem value="LRCN">LRCN</SelectItem>
                                        <SelectItem value="NSCQR">NSCQR</SelectItem>
                                        <SelectItem value="NISLR">NISLR</SelectItem>
                                        <SelectItem value="WLR">WLR</SelectItem>
                                        <SelectItem value="All NLR">All NLR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="partNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Part Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="e.g., 18" 
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="page"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Page Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., 550" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Statute specific fields */}
                  {sourceType === 'statute' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Title of Statute</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Constitution of the Federal Republic of Nigeria" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 1999" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="actNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Act Number</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 3" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="chapter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Chapter</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., U8" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="section"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Section</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 4" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subsection"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Subsection</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 1" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="paragraph"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Paragraph</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., a" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="schedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Schedule</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="orderNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Order Number</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 5" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ruleNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Rule Number</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="alterationInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Alteration Information</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Third Alteration" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Web Resource specific fields */}
                  {sourceType === 'webResource' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Overview of Nigerian Legal System" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="publisher"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Publisher/Website</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Nigerian Bar Association" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2021" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="webAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Web Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., https://www.nigerianbar.org/legal-system" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="accessDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Date of Access</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., 30 September 2021" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Newspaper specific fields */}
                  {sourceType === 'newspaper' && (
                    <div className="space-y-4">
                      <div className="mb-3">
                        <FormField
                          control={form.control}
                          name="isEditorial"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                This is an editorial
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Article Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Legal Reform in Nigeria" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="newspaperName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Newspaper Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., The Guardian" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">City of Publication</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Lagos" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="publicationDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Date of Publication</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 13 October 2012" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="page"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Page Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., 12" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-700">Online Version</h4>
                          <div className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded">Optional</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="webAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Web Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., https://guardian.ng/news/legal-reform" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accessDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Date of Access</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., 15 October 2012" 
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Thesis specific fields */}
                  {sourceType === 'thesis' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Legal and Regulatory Framework for Environmental Protection in Nigeria" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="degreeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Degree Type</FormLabel>
                              <FormControl>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a degree type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LLB Project">LLB Project</SelectItem>
                                    <SelectItem value="LLM Dissertation">LLM Dissertation</SelectItem>
                                    <SelectItem value="PhD Thesis">PhD Thesis</SelectItem>
                                    <SelectItem value="MPhil Thesis">MPhil Thesis</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="faculty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Faculty</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Faculty of Law" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">University</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., University of Lagos" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year of Submission</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2019" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Conference Paper specific fields */}
                  {sourceType === 'conferencePaper' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Paper Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Evolution of Legal Education in Nigeria" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="proceedingsTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Proceedings Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Proceedings of the Annual Conference of Nigerian Law Teachers" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="conferenceName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Conference Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 46th Annual Conference of NALT" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="conferenceLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Conference Location</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., University of Ilorin" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="conferenceDates"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Conference Dates</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 22nd to 26th April 2013" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="page"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Page Range</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., 45-67" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Lecture specific fields */}
                  {sourceType === 'lecture' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Lecture Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., The Role of Law in National Development" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lectureType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Lecture Type</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select lecture type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Inaugural Lecture">Inaugural Lecture</SelectItem>
                                  <SelectItem value="Distinguished Lecture">Distinguished Lecture</SelectItem>
                                  <SelectItem value="Public Lecture">Public Lecture</SelectItem>
                                  <SelectItem value="Memorial Lecture">Memorial Lecture</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="occasion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Occasion (if specific)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., 50th Anniversary Celebration" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="presentationPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Place of Presentation</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Abuja, Nigeria" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="presentationDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Date of Presentation</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 18th November 2013" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Encyclopedia specific fields */}
                  {sourceType === 'encyclopedia' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Title of Encyclopedia</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Halzbury's Laws" 
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="edition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Edition</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 5th edn" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 2010" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="volume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Volume</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="e.g., 57" 
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="paragraph"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Paragraph</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., 53" 
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
                
                {/* Generate button */}
                <div className="mt-8">
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
              <div className="mt-8 p-6 bg-[#C3CDE1]/30 border border-[#C3CDE1] rounded-md">
                <div className="mb-6">
                  <Tabs defaultValue="footnote" onValueChange={setSelectedTab}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#1B387A]">Generated Citation</h3>
                      <TabsList>
                        <TabsTrigger value="footnote">Footnote</TabsTrigger>
                        <TabsTrigger value="bibliography">Bibliography</TabsTrigger>
                      </TabsList>
                    </div>
                  </Tabs>
                </div>
                
                <div className="p-5 bg-white border border-gray-300 rounded font-mono text-sm mb-4">
                  <div className="flex items-start space-x-2">
                    {selectedTab === "footnote" && (
                      <span className="text-xs align-top leading-5">¹</span>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: citation }} />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center bg-yellow-50 text-yellow-700 p-2 rounded-md border border-yellow-200 text-xs">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <p>Always verify citations against the official NALT guide.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Set Footnote/Bibliography based on tab
                        setCitation(selectedTab === "footnote" ? formattedCitation : citation);
                      }}
                      className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Format Help
                    </Button>
                    
                    <Button 
                      type="button" 
                      onClick={copyToClipboard}
                      variant="outline" 
                      className="bg-white hover:bg-gray-100 text-[#1B387A] font-medium py-1.5 px-3 rounded border border-gray-300 text-sm flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
