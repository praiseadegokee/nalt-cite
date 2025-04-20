import { useState } from 'react';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GlossaryTermProps {
  term: string;
  definition: string;
  id?: number;
}

export default function GlossaryTerm({ term, definition, id }: GlossaryTermProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  // Cut off the definition if it's too long (when not expanded)
  const isTruncated = definition.length > 200;
  const displayDefinition = isExpanded ? definition : isTruncated ? `${definition.substring(0, 200)}...` : definition;
  
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
        "bg-white rounded-lg border shadow-sm transition relative group",
        isExpanded 
          ? "border-[#C3CDE1] shadow-md" 
          : "border-gray-200 hover:border-[#C3CDE1] hover:shadow",
        isTruncated && "cursor-pointer"
      )}
      onClick={() => isTruncated && setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-[#294D98] text-lg">{term}</h4>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100"
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
        
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{displayDefinition}</p>
        </div>
        
        {isTruncated && (
          <div className="mt-3 text-right">
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
        <div className="bg-[#F8FAFD] px-4 py-2 border-t border-[#C3CDE1] text-xs text-gray-500 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span>Term ID: {id || 'N/A'}</span>
            <button
              onClick={handleCopy}
              className="text-[#294D98] hover:underline flex items-center"
            >
              <Copy size={12} className="mr-1" />
              Copy full text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
