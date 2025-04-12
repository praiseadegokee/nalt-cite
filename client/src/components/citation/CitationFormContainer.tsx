import { ReactNode } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import SourceTypeSelector from './SourceTypeSelector';

interface CitationFormContainerProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  children?: ReactNode;
}

export default function CitationFormContainer({
  form,
  onSubmit,
  isSubmitting,
  children
}: CitationFormContainerProps) {
  
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Source Type Selection and Dynamic Form Fields */}
          <SourceTypeSelector />
          
          {/* Any additional form elements */}
          {children}
          
          {/* Generate button */}
          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full bg-[#1B387A] hover:bg-[#294D98] text-white font-bold py-3 px-4 rounded-md shadow transition duration-150"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating...' : 'Generate Citation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}