import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateCitation } from '@/lib/citationUtils';

interface CitationContextType {
  citation: string;
  isSubmitting: boolean;
  generateCitationFromData: (data: any) => Promise<void>;
  clearCitation: () => void;
}

const CitationContext = createContext<CitationContextType | undefined>(undefined);

// Custom hook to use the citation context
const useCitation = () => {
  const context = useContext(CitationContext);
  if (context === undefined) {
    throw new Error('useCitation must be used within a CitationProvider');
  }
  return context;
};

function CitationProvider({ children }: { children: ReactNode }) {
  const [citation, setCitation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  async function generateCitationFromData(data: any) {
    try {
      setIsSubmitting(true);
      
      // Add a small delay to show loading state
      await new Promise(r => setTimeout(r, 500));
      
      // Generate citation based on form data
      const formattedCitation = generateCitation(data);
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

  function clearCitation() {
    setCitation('');
  }

  return (
    <CitationContext.Provider 
      value={{ 
        citation, 
        isSubmitting, 
        generateCitationFromData, 
        clearCitation 
      }}
    >
      {children}
    </CitationContext.Provider>
  );
}

export { CitationProvider, useCitation };