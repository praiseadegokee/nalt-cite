import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition cursor-pointer relative group"
      onClick={() => isTruncated && setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-[#294D98]">{term}</h4>
        <button 
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
        >
          <Copy size={16} className="text-gray-500" />
        </button>
      </div>
      <p className="text-gray-700">{displayDefinition}</p>
      
      {isTruncated && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-[#294D98] text-sm font-medium mt-2 hover:underline"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
