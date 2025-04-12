import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CitationProvider } from '@/context/CitationContext';
import { useCitationForm, CitationFormValues } from '@/hooks/citation/useCitationForm';
import { generateCitation } from '@/lib/citationUtils';
import CitationFormContainer from '@/components/citation/CitationFormContainer';
import CitationResult from '@/components/citation/CitationResult';

// Main generator component
function CitationGeneratorContent() {
  const [citation, setCitation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useCitationForm();
  
  async function onSubmit(data: CitationFormValues) {
    console.log("onSubmit function called with data:", data);
    try {
      setIsSubmitting(true);
      
      // Add a small delay to show loading state
      await new Promise(r => setTimeout(r, 500));
      
      // Generate citation based on form data
      console.log("About to generate citation with data:", data);
      const formattedCitation = generateCitation(data);
      console.log("Generated citation:", formattedCitation);
      
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

// Wrapping component for future context usage
export default function CitationGenerator() {
  return <CitationGeneratorContent />;
}
