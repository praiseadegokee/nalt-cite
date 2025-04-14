import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the form validation schema
const formSchema = z.object({
  term: z.string().min(1, 'Term is required').max(100, 'Term must be less than 100 characters'),
  definition: z.string().min(1, 'Definition is required').max(1000, 'Definition must be less than 1000 characters'),
  category: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddGlossaryTerm() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      definition: '',
      category: '',
    },
  });
  
  // Mutation for adding a new glossary term
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch('/api/glossary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add glossary term');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Success!',
        description: 'Your glossary term has been added.',
        variant: 'default',
      });
      setLocation('/glossary');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add glossary term. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-[#294D98] flex items-center" 
              onClick={() => setLocation('/glossary')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Glossary
            </Button>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#1B387A]">Add New Glossary Term</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1B387A] font-medium">Term</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter term name" 
                          {...field} 
                          className="focus:ring-[#294D98] focus:border-[#294D98]"
                        />
                      </FormControl>
                      <FormDescription>
                        The legal or citation term you want to define.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1B387A] font-medium">Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-[#294D98] focus:border-[#294D98]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="legal">Legal Term</SelectItem>
                          <SelectItem value="citation">Citation Term</SelectItem>
                          <SelectItem value="research">Research Term</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this term belongs to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="definition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1B387A] font-medium">Definition</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter definition" 
                          {...field} 
                          className="focus:ring-[#294D98] focus:border-[#294D98] min-h-[150px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear and concise definition of the term.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-[#294D98] hover:bg-[#1B387A] w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Term...
                    </>
                  ) : 'Add Glossary Term'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}