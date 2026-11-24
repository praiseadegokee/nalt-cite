import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import AlphabetFilter from '@/components/AlphabetFilter';
import GlossaryTerm from '@/components/GlossaryTerm';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { 
  Loader2, 
  Search, 
  Download, 
  BookOpen,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
  Library
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Glossary() {
  useSEO({
    title: "Legal Glossary - Nigerian Legal Maxims & Citation Terms | NALT Cite",
    description: "Authoritative dictionary of Nigerian legal maxims, citation abbreviations, and procedural terminology defined under the NALT Uniform Format Guide.",
    keywords: "legal glossary, Nigerian law terms, Latin legal maxims, legal definitions, NALT format terms, Nigerian legal vocabulary",
    canonicalUrl: "https://naltcite.replit.app/glossary"
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  
  // Set up debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch data from API
  const { data: terms = [], isLoading, isError, refetch } = useQuery<GlossaryTermType[]>({
    queryKey: ['/api/glossary', selectedLetter, debouncedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLetter) {
        params.append('letter', selectedLetter);
      }
      if (debouncedSearchTerm) {
        params.append('query', debouncedSearchTerm);
      }
      const response = await fetch(`/api/glossary?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch glossary terms');
      }
      return response.json();
    },
  });

  // Client-side sort
  const sortedTerms = useMemo(() => {
    return [...terms].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.term.localeCompare(b.term);
      } else {
        return b.term.localeCompare(a.term);
      }
    });
  }, [terms, sortOrder]);

  const exportGlossary = () => {
    const glossaryText = terms.map((term: GlossaryTermType) => 
      `${term.term}\n${term.definition}\n\n`
    ).join('');
    
    const blob = new Blob([glossaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nalt-legal-glossary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Glossary Exported",
      description: "Downloaded legal glossary as a plain text file.",
    });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Editorial Top Card */}
        <div className="bg-[#1c3877] text-white rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Official Academic Lexicon • NALT 2021 Reference</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
              Legal Citation & Research Glossary
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans max-w-2xl">
              Authoritative definitions of Latin legal maxims, law report abbreviations (NWLR, All NLR), procedural conventions, and citation terminology according to the Nigerian Association of Law Teachers standard.
            </p>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none font-serif text-[180px] font-black select-none leading-none">
            §
          </div>
        </div>

        {/* Filter and Search Bar Station */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search term or definition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 py-2 bg-slate-50 border-slate-200 rounded-lg text-xs focus-visible:ring-1 focus-visible:ring-[#1c3877]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-8 text-xs font-medium border-slate-300 text-slate-700 hover:text-[#1c3877] gap-1.5"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Sort {sortOrder === 'asc' ? 'Z–A' : 'A–Z'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportGlossary}
                className="h-8 text-xs font-medium border-slate-300 text-slate-700 hover:text-[#1c3877] gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export (.txt)</span>
              </Button>
            </div>
          </div>

          {/* Alphabet Index */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 font-mono">
                Browse Alphabetically:
              </span>
              <span className="font-mono text-[11px]">
                Showing {sortedTerms.length} {sortedTerms.length === 1 ? 'term' : 'terms'}
              </span>
            </div>
            <AlphabetFilter 
              selectedLetter={selectedLetter}
              onSelectLetter={(letter) => {
                setSelectedLetter(letter);
                setSearchTerm('');
              }}
            />
          </div>
        </div>

        {/* Terms Grid */}
        <div>
          {isLoading ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-[#1c3877] mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Retrieving legal glossary terms...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-200">
              <p className="text-xs text-red-600 mb-2">Error loading glossary records.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">
                Retry
              </Button>
            </div>
          ) : sortedTerms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">No Legal Terms Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No glossary entries match your filter. Select another letter or clear search.
              </p>
              {(searchTerm || selectedLetter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLetter('');
                  }}
                  className="text-xs"
                >
                  View All Terms
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTerms.map((term: GlossaryTermType) => (
                <GlossaryTerm 
                  key={term.id}
                  id={term.id}
                  term={term.term}
                  definition={term.definition}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
