import { useState, useEffect } from 'react';
import { Copy, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface GlossaryTermProps {
  term: string;
  definition: string;
  id?: number;
}

export default function GlossaryTerm({ term, definition, id }: GlossaryTermProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Set different truncation length for mobile
  const truncationLength = isMobile ? 150 : 200;
  
  // Cut off the definition if it's too long (when not expanded)
  const isTruncated = definition.length > truncationLength;
  const displayDefinition = isExpanded 
    ? definition 
    : isTruncated 
      ? `${definition.substring(0, truncationLength)}...` 
      : definition;
  
  // Reset expanded state when switching between mobile and desktop
  useEffect(() => {
    setIsExpanded(false);
  }, [isMobile]);
  
  // Handle copying the term and definition to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${term}: ${definition}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied!",
        description: "Term and definition copied to clipboard",
        duration: 2000,
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    });
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border shadow-sm transition-all duration-200 relative group",
        isExpanded 
          ? "border-[#C3CDE1] shadow-md" 
          : "border-gray-200 hover:border-[#C3CDE1] hover:shadow",
        isTruncated && "cursor-pointer"
      )}
      onClick={() => isTruncated && setIsExpanded(!isExpanded)}
    >
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start sm:items-center mb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-8 w-8 rounded-full bg-[#1B387A]/10 items-center justify-center flex-shrink-0">
              <BookOpen size={16} className="text-[#1B387A]" />
            </div>
            <h4 className="font-bold text-[#294D98] text-base sm:text-lg leading-tight">{term}</h4>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button 
              onClick={handleCopy}
              className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-500 hover:text-[#294D98]" />
            </button>
            
            {isTruncated && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100"
                title={isExpanded ? "Show less" : "Show more"}
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? 
                  <ChevronUp size={18} className="text-[#294D98]" /> : 
                  <ChevronDown size={18} className="text-[#294D98]" />
                }
              </button>
            )}
          </div>
        </div>
        
        <div className={cn(
          "prose prose-sm max-w-none transition-all duration-300",
          isExpanded && "prose-p:text-base"
        )}>
          <p className="text-gray-700 leading-relaxed">{displayDefinition}</p>
        </div>
        
        {isTruncated && (
          <div className={cn(
            "mt-3 flex justify-end",
            isExpanded ? "opacity-0 sm:opacity-100" : "opacity-100"
          )}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }} 
              className="text-[#294D98] text-sm font-medium inline-flex items-center hover:underline"
            >
              {isExpanded ? "Show less" : "Read more"}
              {isExpanded ? 
                <ChevronUp size={16} className="ml-1" /> : 
                <ChevronDown size={16} className="ml-1" />
              }
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="bg-[#F8FAFD] px-4 py-3 border-t border-[#C3CDE1] text-xs text-gray-500 rounded-b-lg flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex items-center">
            <span className="bg-[#1B387A]/10 text-[#1B387A] py-1 px-2 rounded-full mr-2">ID: {id || 'N/A'}</span>
            <span className="text-gray-500">Legal terminology</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-[#294D98] hover:underline flex items-center self-end sm:self-auto"
          >
            <Copy size={12} className="mr-1" />
            Copy full text
          </button>
        </div>
      )}
    </div>
  );
}
