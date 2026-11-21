import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateCitation } from '@/lib/citationUtils';
import { generateBibliography, generateBibTeX } from '@/lib/citationBiblioFormatters';

interface CitationContextType {
  citation: string;
  bibliography: string;
  bibtex: string;
  formData: any;
  isSubmitting: boolean;
  generateCitationFromData: (data: any) => Promise<void>;
  updateLivePreview: (data: any) => void;
  clearCitation: () => void;
}

const CitationContext = createContext<CitationContextType | undefined>(undefined);

// Custom hook to use the citation context
export const useCitation = () => {
  const context = useContext(CitationContext);
  if (context === undefined) {
    throw new Error('useCitation must be used within a CitationProvider');
  }
  return context;
};

export function CitationProvider({ children }: { children: ReactNode }) {
  const [citation, setCitation] = useState<string>('');
  const [bibliography, setBibliography] = useState<string>('');
  const [bibtex, setBibtex] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Helper to format case data with parties
  const prepareData = (data: any) => {
    const prepared = { ...data };
    if (prepared.sourceType === 'case') {
      if (!prepared.caseName && prepared.parties && prepared.parties.length >= 2) {
        const plaintiff = prepared.parties.find((p: any) => 
          ['Plaintiff', 'Appellant', 'Applicant', 'Petitioner'].includes(p.role) && p.name?.trim() !== ''
        );
        const defendant = prepared.parties.find((p: any) => 
          ['Defendant', 'Respondent', 'Accused', 'Objector'].includes(p.role) && p.name?.trim() !== ''
        );
        if (plaintiff?.name && defendant?.name) {
          prepared.caseName = `${plaintiff.name} v ${defendant.name}`;
        }
      }
    }
    return prepared;
  };

  // Live preview updater without toast or artificial delay
  function updateLivePreview(data: any) {
    if (!data || !data.sourceType) return;
    try {
      const prepared = prepareData(data);
      setFormData(prepared);
      const formattedFootnote = generateCitation(prepared);
      const formattedBiblio = generateBibliography(prepared);
      const formattedBibtex = generateBibTeX(prepared);
      
      setCitation(formattedFootnote);
      setBibliography(formattedBiblio);
      setBibtex(formattedBibtex);
    } catch (err) {
      // Silent error during live typing
      console.debug("Live preview formatting error:", err);
    }
  }

  async function generateCitationFromData(data: any) {
    try {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 300));
      
      if (!data.sourceType) {
        throw new Error("Missing source type");
      }
      
      const prepared = prepareData(data);
      setFormData(prepared);
      
      const formattedCitation = generateCitation(prepared);
      const formattedBiblio = generateBibliography(prepared);
      const formattedBibtex = generateBibTeX(prepared);
      
      setCitation(formattedCitation);
      setBibliography(formattedBiblio);
      setBibtex(formattedBibtex);
      
      toast({
        title: "Citation Generated",
        description: "Your official NALT citations (Footnote & Bibliography) are ready.",
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
    setBibliography('');
    setBibtex('');
    setFormData(null);
  }

  return (
    <CitationContext.Provider 
      value={{ 
        citation, 
        bibliography,
        bibtex,
        formData,
        isSubmitting, 
        generateCitationFromData, 
        updateLivePreview,
        clearCitation 
      }}
    >
      {children}
    </CitationContext.Provider>
  );
}
export default CitationProvider;
