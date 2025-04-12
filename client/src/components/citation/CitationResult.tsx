import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, FileText, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  copyCitationToClipboard, 
  downloadCitationAsText, 
  exportToWord 
} from '@/lib/citationExportUtils';

interface CitationResultProps {
  citation: string;
}

export default function CitationResult({ citation }: CitationResultProps) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const citationRef = useRef<HTMLDivElement>(null);

  // Function to copy citation to clipboard
  const copyToClipboard = async () => {
    const success = await copyCitationToClipboard(citation);
    
    if (success) {
      setHasCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Citation has been copied to your clipboard.",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to download text file
  const handleDownloadText = () => {
    downloadCitationAsText(citation);
    
    toast({
      title: "Citation downloaded",
      description: "Your citation has been downloaded as a text file.",
    });
  };
  
  // Function to export to Word
  const handleExportToWord = () => {
    exportToWord(citation);
    
    toast({
      title: "Citation exported",
      description: "Your citation has been exported as a Word document.",
    });
  };

  return (
    <div className="mt-8 p-6 bg-[#C3CDE1]/30 border border-[#C3CDE1] rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Generated Citation:</h3>
        <div className="text-xs text-gray-500">NALT Format</div>
      </div>
      <div 
        ref={citationRef}
        className="p-6 bg-white border border-gray-300 rounded-md shadow-inner font-serif text-base break-words leading-relaxed tracking-wide"
        dangerouslySetInnerHTML={{ __html: citation }}
      />
      <div className="mt-6 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Use this citation in your legal document
        </div>
        <div className="flex space-x-3">
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-gray-100 text-[#1B387A] font-medium py-1.5 px-3 rounded-md border border-gray-300 text-sm flex items-center transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export citation in different formats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadText}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Text (.txt)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportToWord}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Word (.docx)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            type="button" 
            onClick={copyToClipboard}
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-[#1B387A] font-medium py-1.5 px-3 rounded-md border border-gray-300 text-sm flex items-center transition-colors"
          >
            {hasCopied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}