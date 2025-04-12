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
    // Debug log to see what's in the form data
    console.log("Form data being submitted:", data);
    
    const sourceType = data.sourceType;
    if (!sourceType) {
      console.log("Source type is missing");
      toast({
        title: "Missing source type",
        description: "Please select a source type to generate your citation.",
        variant: "destructive",
      });
      return;
    }
    
    // Check form errors
    if (Object.keys(form.formState.errors).length > 0) {
      // Get error messages
      const errorMessages = Object.entries(form.formState.errors)
        .map(([field, error]) => `${field}: ${error.message}`)
        .join(', ');
      
      console.log("Form validation errors:", form.formState.errors);
      console.log("Error messages:", errorMessages);
      
      toast({
        title: "Form validation errors",
        description: "Please correct the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // For case citations, do additional validation based on case type
    if (sourceType === 'case') {
      const caseType = data.caseType;
      
      // Make sure parties are entered properly
      if (!data.parties || data.parties.length < 2) {
        toast({
          title: "Missing party information",
          description: "Please enter at least two parties (plaintiff and defendant).",
          variant: "destructive",
        });
        return;
      }
      
      if (caseType === 'reported') {
        if (!data.yearReported || !data.lawReportAbbreviation) {
          toast({
            title: "Missing reported case information",
            description: "For reported cases, please enter the Year and Law Report Abbreviation.",
            variant: "destructive",
          });
          return;
        }
      } else if (caseType === 'unreported' && !data.isUnreportedSimple) {
        if (!data.caseNumber || !data.court) {
          toast({
            title: "Missing unreported case information",
            description: "For detailed unreported cases, please enter the Case Number and Court.",
            variant: "destructive",
          });
          return;
        }
      }
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