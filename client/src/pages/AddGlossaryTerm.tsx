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
import { Loader2, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form validation schema
const formSchema = z.object({
  term: z.string()
    .min(1, 'Term is required')
    .max(100, 'Term must be less than 100 characters')
    .refine(val => /^[A-Za-z]/.test(val), {
      message: "Term must start with a letter"
    }),
  definition: z.string()
    .min(1, 'Definition is required')
    .max(1000, 'Definition must be less than 1000 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddGlossaryTerm() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      definition: '',
    },
    mode: 'onChange',
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
      setLocation('/admin/glossary');
    },
    onError: (error: Error) => {
      setFormError(error.message || 'Failed to add glossary term. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to add glossary term. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setFormError(null);
    mutation.mutate(data);
  };
  
  return (
    <motion.section 
      className="py-16 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              className="text-[#294D98] flex items-center" 
              onClick={() => setLocation('/admin/glossary')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Glossary Management
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center mb-6">
              <BookOpen className="h-7 w-7 text-[#294D98] mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B387A]">Add New Glossary Term</h2>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
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
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#294D98] hover:bg-[#1B387A] w-full"
                    disabled={mutation.isPending || !form.formState.isValid}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Term...
                      </>
                    ) : 'Add Glossary Term'}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
          
          <motion.div
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for creating quality glossary terms:</h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Make terms clear and concise</li>
              <li>Use proper legal terminology and Nigerian legal context</li>
              <li>Include relevant citation examples when helpful</li>
              <li>Define abbreviations and Latin phrases when used</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}