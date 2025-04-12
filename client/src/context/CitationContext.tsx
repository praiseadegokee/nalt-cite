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
      console.log("CitationContext: Starting citation generation with data:", data);
      
      // Add a small delay to show loading state
      await new Promise(r => setTimeout(r, 500));
      
      // Validate sourceType
      if (!data.sourceType) {
        console.error("CitationContext: Missing sourceType in data");
        throw new Error("Missing source type");
      }
      
      console.log(`CitationContext: Generating citation for sourceType: ${data.sourceType}`);
      
      // For case citations, ensure case name is set
      if (data.sourceType === 'case') {
        if (!data.caseName && data.parties && data.parties.length >= 2) {
          // If case name is missing but we have parties, try to generate it
          const plaintiff = data.parties.find((p: any) => 
            ['Plaintiff', 'Appellant', 'Applicant', 'Petitioner'].includes(p.role) && p.name.trim() !== ''
          );
          
          const defendant = data.parties.find((p: any) => 
            ['Defendant', 'Respondent', 'Accused', 'Objector'].includes(p.role) && p.name.trim() !== ''
          );
          
          if (plaintiff?.name && defendant?.name) {
            data.caseName = `${plaintiff.name} v ${defendant.name}`;
            console.log(`CitationContext: Auto-generated case name: ${data.caseName}`);
          }
        }
        
        if (!data.caseName) {
          console.error("CitationContext: Missing case name for case citation");
        }
      }
      
      // Generate citation based on form data
      const formattedCitation = generateCitation(data);
      console.log("CitationContext: Generated citation:", formattedCitation);
      
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