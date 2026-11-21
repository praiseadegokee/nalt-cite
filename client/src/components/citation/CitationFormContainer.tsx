import { ReactNode } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { CitationFormValues } from '@/hooks/citation/useCitationForm';
import SourceTypeSelector from './SourceTypeSelector';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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
    
    // Check form errors
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        title: "Incomplete details",
        description: "Please check the required fields marked in the form.",
        variant: "destructive",
      });
      return;
    }
    
    // For case citations, validate parties
    if (sourceType === 'case') {
      const caseType = data.caseType;
      if (!data.parties || data.parties.length < 2) {
        toast({
          title: "Missing party information",
          description: "Please enter both parties (e.g. Plaintiff vs Defendant).",
          variant: "destructive",
        });
        return;
      }
      
      if (caseType === 'reported') {
        if (!data.yearReported || !data.lawReportAbbreviation) {
          toast({
            title: "Missing reported case details",
            description: "For reported cases, Year and Law Report abbreviation (e.g. NWLR) are required.",
            variant: "destructive",
          });
          return;
        }
      } else if (caseType === 'unreported' && !data.isUnreportedSimple) {
        if (!data.caseNumber || !data.court) {
          toast({
            title: "Missing unreported case details",
            description: "Please provide the Suit/Appeal number and the Court name.",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    onSubmit(data);
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Container Header */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Citation Parameters</span>
            <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live Sync Active
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a legal source and enter publication records.
          </p>
        </div>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Source Type Selection and Dynamic Form Fields */}
            <SourceTypeSelector />
            
            {/* Additional custom form elements */}
            {children}
            
            {/* Submit / Format Action */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Live preview updates as you type
              </span>
              <Button 
                type="submit" 
                className="w-full sm:w-auto ml-auto bg-[#1c3877] hover:bg-[#0f2047] text-white font-medium text-xs py-2.5 px-6 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Formatting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    <span>Generate Official Citations</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
