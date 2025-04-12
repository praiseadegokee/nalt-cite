import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

// Define form schema with Zod
const formSchema = z.object({
  sourceType: z.string().min(1, "Source type is required"),
  author: z.string().min(1, "Author is required"),
  title: z.string().min(1, "Title is required"),
  edition: z.string().optional(),
  publisher: z.string().min(1, "Publisher is required"),
  year: z.string().min(1, "Year is required"),
  page: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CitationGenerator() {
  const [citation, setCitation] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: "",
      author: "",
      title: "",
      edition: "",
      publisher: "",
      year: "",
      page: "",
    },
  });

  function onSubmit(data: FormValues) {
    // Simple citation formatter - in a real app this would be more sophisticated
    // and would handle different source types differently
    let formattedCitation = "";
    
    // Format based on source type
    if (data.sourceType === "book") {
      formattedCitation = `${data.author}, <i>${data.title}</i>`;
      
      if (data.edition) {
        formattedCitation += ` (${data.edition}, ${data.publisher} ${data.year})`;
      } else {
        formattedCitation += ` (${data.publisher} ${data.year})`;
      }
      
      if (data.page) {
        formattedCitation += ` ${data.page}`;
      }
    } else {
      // Basic format for other types
      formattedCitation = `${data.author}, <i>${data.title}</i> (${data.publisher} ${data.year})`;
      
      if (data.page) {
        formattedCitation += ` ${data.page}`;
      }
    }
    
    setCitation(formattedCitation);
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Source Type Selection */}
                <FormField
                  control={form.control}
                  name="sourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Source Type</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                            <SelectValue placeholder="Select a source type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="case">Cases</SelectItem>
                            <SelectItem value="statute">Statutes</SelectItem>
                            <SelectItem value="book">Books</SelectItem>
                            <SelectItem value="bookChapter">Chapters in Edited Books</SelectItem>
                            <SelectItem value="journalArticle">Journal Articles</SelectItem>
                            <SelectItem value="onlineSource">Online Sources</SelectItem>
                            <SelectItem value="conferencePaper">Conference Papers</SelectItem>
                            <SelectItem value="newspaper">Newspapers/Magazines</SelectItem>
                            <SelectItem value="thesis">Projects/Theses</SelectItem>
                            <SelectItem value="lecture">Inaugural/Distinguished Lectures</SelectItem>
                            <SelectItem value="encyclopedia">Encyclopedias</SelectItem>
                            <SelectItem value="monograph">Monographs</SelectItem>
                            <SelectItem value="lectureNote">Lecture Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Author */}
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Author(s)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., O Oyewo" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <p className="mt-1 text-sm text-gray-500">Format: Initial Surname (e.g., O Oyewo)</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Constitutional Law in Nigeria" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Edition */}
                <FormField
                  control={form.control}
                  name="edition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Edition (if applicable)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., 2nd edn" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Publisher */}
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Publisher</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., University Press Limited" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Year */}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Page Number */}
                <FormField
                  control={form.control}
                  name="page"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Page Number (if applicable)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., 25" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
