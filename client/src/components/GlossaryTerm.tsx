import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GlossaryTermProps {
  term: string;
  definition: string;
  id?: number;
}

export default function GlossaryTerm({ term, definition, id }: GlossaryTermProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  
  const isTruncated = definition.length > 220;
  const displayDefinition = isExpanded ? definition : isTruncated ? `${definition.substring(0, 220)}...` : definition;
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${term}: ${definition}`);
      setHasCopied(true);
      toast({
        title: "Copied",
        description: `Definition for "${term}" copied to clipboard.`,
      });
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy definition.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all duration-200 flex flex-col justify-between group",
        isExpanded ? "border-[#1c3877]/60 shadow-sm" : "hover:border-slate-300 hover:shadow-xs",
        isTruncated && "cursor-pointer"
      )}
      onClick={() => isTruncated && setIsExpanded(!isExpanded)}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#1c3877]/10 text-[#1c3877] font-serif font-bold text-xs flex items-center justify-center shrink-0">
              §
            </span>
            <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#1c3877] transition-colors leading-tight">
              {term}
            </h4>
          </div>

          <button 
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#1c3877] transition-colors shrink-0"
            title="Copy definition"
          >
            {hasCopied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-sans">
          {displayDefinition}
        </p>
      </div>

      {isTruncated && (
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }} 
            className="text-[11px] font-semibold text-[#1c3877] hover:underline inline-flex items-center gap-1"
          >
            <span>{isExpanded ? "Show less" : "Read full definition"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
