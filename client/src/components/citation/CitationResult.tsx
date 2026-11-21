import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileCode, 
  BookOpen, 
  ListOrdered, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  exportToWord,
  downloadBibTeX,
  getPlainTextCitation
} from '@/lib/citationExportUtils';

interface CitationResultProps {
  citation: string;
  bibliography?: string;
  bibtex?: string;
  isLivePreview?: boolean;
}

export default function CitationResult({ 
  citation, 
  bibliography = '', 
  bibtex = '', 
  isLivePreview = false 
}: CitationResultProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'footnote' | 'bibliography' | 'bibtex'>('footnote');
  const [hasCopied, setHasCopied] = useState(false);
  const citationRef = useRef<HTMLDivElement>(null);

  const currentContent = activeTab === 'footnote' 
    ? citation 
    : activeTab === 'bibliography' 
      ? (bibliography || citation) 
      : bibtex;

  const currentLabel = activeTab === 'footnote'
    ? 'Footnote Citation'
    : activeTab === 'bibliography'
      ? 'Bibliography Entry'
      : 'BibTeX Source';

  // Function to copy citation to clipboard
  const handleCopy = async () => {
    if (!currentContent) return;
    const textToCopy = activeTab === 'bibtex' ? currentContent : currentContent;
    const success = await copyCitationToClipboard(textToCopy);
    
    if (success) {
      setHasCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: `${currentLabel} copied with formatting preserved.`,
      });
      setTimeout(() => setHasCopied(false), 2000);
    } else {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadText = () => {
    if (!currentContent) return;
    downloadCitationAsText(currentContent, `nalt-${activeTab}.txt`);
    toast({
      title: "Text Downloaded",
      description: `Your ${activeTab} citation has been downloaded.`,
    });
  };

  const handleExportToWord = () => {
    if (!currentContent) return;
    exportToWord(currentContent, `NALT ${currentLabel}`);
    toast({
      title: "Exported to Word",
      description: "Word document downloaded with standard 0.5in hanging indent.",
    });
  };

  const handleDownloadBibTeX = () => {
    if (!bibtex) return;
    downloadBibTeX(bibtex, 'citation.bib');
    toast({
      title: "BibTeX Exported",
      description: "Downloaded citation.bib for LaTeX / Zotero / Mendeley.",
    });
  };

  const hasContent = Boolean(citation && citation.trim() !== '');

  if (!hasContent) {
    return (
      <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-[#1c3877] flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-5 h-5 text-[#1c3877]/70" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">Live Citation Preview</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Complete the form fields on the left. Your NALT-compliant footnote and bibliography entries will appear here instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Card Header & Format Switcher Tabs */}
      <div className="bg-[#1c3877] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-serif font-bold text-blue-200">
            §
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              {isLivePreview ? 'Live NALT Preview' : 'Generated Citation'}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>NALT Uniform Format (2021)</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-[#0f2047]/60 p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('footnote')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all duration-150 ${
              activeTab === 'footnote'
                ? 'bg-white text-[#1c3877] shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Footnote</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('bibliography')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all duration-150 ${
              activeTab === 'bibliography'
                ? 'bg-white text-[#1c3877] shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bibliography</span>
          </button>

          {bibtex && (
            <button
              type="button"
              onClick={() => setActiveTab('bibtex')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all duration-150 ${
                activeTab === 'bibtex'
                  ? 'bg-white text-[#1c3877] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>BibTeX</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Display Area */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            {activeTab === 'footnote' && 'Standard Footnote (Bottom of Page)'}
            {activeTab === 'bibliography' && 'Bibliography / Table of Authorities (Alphabetized)'}
            {activeTab === 'bibtex' && 'BibTeX Citation Entry'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeTab === 'bibtex' ? 'raw syntax' : 'rendered text'}
          </span>
        </div>

        {activeTab === 'bibtex' ? (
          <pre className="p-4 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
            {bibtex}
          </pre>
        ) : (
          <div 
            ref={citationRef}
            className="p-4 sm:p-5 bg-white border border-slate-200 rounded-lg shadow-xs font-serif text-slate-900 text-sm sm:text-base break-words leading-relaxed tracking-wide select-all"
            dangerouslySetInnerHTML={{ 
              __html: activeTab === 'footnote' ? citation : (bibliography || citation) 
            }}
          />
        )}

        {/* NALT Editorial Guidance Note */}
        <div className="mt-3 text-[11px] text-slate-500 flex items-start gap-1.5">
          <span className="font-semibold text-slate-700 shrink-0">Rule Note:</span>
          <span>
            {activeTab === 'footnote' && 'In footnotes, authors are cited Firstname Initial Surname without inversion. Case names are strictly italicized with italicized "v."'}
            {activeTab === 'bibliography' && 'In bibliography, primary authors are inverted (Surname, Initial.) for alphabetical listing. Punctuation follows NALT rules with no final full stop.'}
            {activeTab === 'bibtex' && 'BibTeX keys and field structures conform to standard LaTeX/BibLaTeX Nigerian law referencing conventions.'}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Ready for legal briefs, dissertations, and law journals.
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs font-medium border-slate-300 text-slate-700 hover:text-[#1c3877] hover:bg-slate-50 gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuLabel className="text-[11px] font-semibold text-slate-500">
                Download Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportToWord} className="cursor-pointer">
                <FileText className="h-3.5 w-3.5 mr-2 text-blue-600" />
                <span>Microsoft Word (.doc)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadText} className="cursor-pointer">
                <FileText className="h-3.5 w-3.5 mr-2 text-slate-600" />
                <span>Plain Text (.txt)</span>
              </DropdownMenuItem>
              {bibtex && (
                <DropdownMenuItem onClick={handleDownloadBibTeX} className="cursor-pointer">
                  <FileCode className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  <span>BibTeX File (.bib)</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            type="button" 
            onClick={handleCopy}
            size="sm"
            className="h-8 text-xs font-medium bg-[#1c3877] hover:bg-[#0f2047] text-white shadow-xs gap-1.5 transition-colors"
          >
            {hasCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-blue-200" />
                <span>Copy {activeTab === 'footnote' ? 'Footnote' : activeTab === 'bibliography' ? 'Bibliography' : 'BibTeX'}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
