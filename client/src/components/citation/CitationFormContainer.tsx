import { ReactNode } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { validateSourceFields } from '@/lib/citationValidator';
import { CitationFormValues } from '@/hooks/citation/useCitationForm';
import SourceTypeSelector from './SourceTypeSelector';

interface CitationFormContainerProps {
  form: UseFormReturn<CitationFormValues>;
  onSubmit: (data: CitationFormValues) => void;
  isSubmitting: boolean;
  children?: ReactNode;
}

export default function CitationFormContainer({
  form,
  onSubmit,
  isSubmitting,
  children
}: CitationFormContainerProps) {
  const { toast } = useToast();
  
  const handleSubmit = (data: CitationFormValues) => {
    const sourceType = data.sourceType;
    if (!sourceType) {
      toast({
        title: "Missing source type",
        description: "Please select a source type to generate your citation.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields based on source type
    const { isValid, missingFields } = validateSourceFields(data, sourceType);
    
    if (!isValid) {
      toast({
        title: "Missing required fields",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // All validation passed, submit the form
    onSubmit(data);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-[#1B387A]">Citation Details</h3>
            <p className="text-sm text-gray-500 mt-1">
              Select a source type and fill in the required information to generate a citation.
            </p>
          </div>
          
          {/* Source Type Selection and Dynamic Form Fields */}
          <SourceTypeSelector />
          
          {/* Any additional form elements */}
          {children}
          
          {/* Generate button */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Button 
              type="submit" 
              className="w-full bg-[#1B387A] hover:bg-[#294D98] text-white font-bold py-3 px-4 rounded-md shadow transition duration-150"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : 'Generate Citation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}