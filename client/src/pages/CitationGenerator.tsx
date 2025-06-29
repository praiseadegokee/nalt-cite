import React from 'react';
import { CitationProvider, useCitation } from '@/context/CitationContext';
import { useCitationForm, CitationFormValues } from '@/hooks/citation/useCitationForm';
import CitationFormContainer from '@/components/citation/CitationFormContainer';
import CitationResult from '@/components/citation/CitationResult';
import { useSEO } from '@/hooks/use-seo';

// Main generator component that uses CitationContext
function CitationGeneratorContent() {
  const { citation, isSubmitting, generateCitationFromData } = useCitation();
  const form = useCitationForm();
  
  async function onSubmit(data: CitationFormValues) {
    console.log("CitationGenerator: onSubmit called with data:", data);
    
    // Ensure sourceType is set to 'case' for the case form
    if (form.getValues('caseType') && !data.sourceType) {
      console.log("CitationGenerator: Setting sourceType to 'case'");
      data.sourceType = 'case';
    }
    
    // Call the context method to generate citation
    await generateCitationFromData(data);
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

// Wrapping component with CitationProvider
export default function CitationGenerator() {
  useSEO({
    title: "NALT Citation Generator - Create Accurate Nigerian Legal Citations",
    description: "Generate professional NALT format citations for Nigerian legal documents. Support for cases, statutes, books, journal articles, and more. Automatic formatting according to NALT standards.",
    keywords: "NALT citation generator, Nigerian legal citations, case citation, statute citation, legal bibliography, NALT format, Nigerian law citations",
    canonicalUrl: "https://naltcite.com/citation-generator"
  });

  return (
    <CitationProvider>
      <CitationGeneratorContent />
    </CitationProvider>
  );
}
