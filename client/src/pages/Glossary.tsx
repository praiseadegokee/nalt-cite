import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import AlphabetFilter from '@/components/AlphabetFilter';
import GlossaryTerm from '@/components/GlossaryTerm';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useSEO } from '@/hooks/use-seo';
import { 
  Loader2, 
  Search, 
  Plus, 
  Download, 
  BookOpen,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Glossary() {
  useSEO({
    title: "Legal Glossary - Nigerian Law Terms & Definitions | NALT Cite",
    description: "Comprehensive glossary of Nigerian legal terms and definitions. Search alphabetically or by keyword. Essential reference for law students and legal practitioners studying Nigerian law.",
    keywords: "legal glossary, Nigerian law terms, legal definitions, law dictionary Nigeria, legal terminology, NALT legal terms, Nigerian legal vocabulary",
    canonicalUrl: "https://naltcite.com/glossary"
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTerm, setNewTerm] = useState({ term: '', definition: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  
  // Set up debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch data from API
  const { data: terms = [], isLoading, isError, refetch } = useQuery({
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
    enabled: true,
  });
  
  // Mutation for adding a new term
  const addTermMutation = useMutation({
    mutationFn: async (data: { term: string; definition: string }) => {
      const response = await fetch('/api/glossary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add glossary term');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: "Term Added!",
        description: "Your glossary term has been successfully added.",
      });
      setShowAddDialog(false);
      setNewTerm({ term: '', definition: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to add term. Please try again.',
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleAddTerm = () => {
    if (!newTerm.term.trim() || !newTerm.definition.trim()) {
      toast({
        title: "Validation Error",
        description: "Both term and definition are required.",
        variant: "destructive",
      });
      return;
    }
    
    addTermMutation.mutate(newTerm);
  };
  
  // Filter and sort terms
  const filteredAndSortedTerms = useMemo(() => {
    // First apply filters
    const filtered = terms.filter((term: GlossaryTermType) => {
      const matchesSearch = debouncedSearchTerm ? 
        (term.term.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
         term.definition.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) : true;
      const matchesLetter = !selectedLetter || term.term.charAt(0).toUpperCase() === selectedLetter.toUpperCase();
      
      return matchesSearch && matchesLetter;
    });
    
    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.term.localeCompare(b.term);
      } else {
        return b.term.localeCompare(a.term);
      }
    });
  }, [terms, debouncedSearchTerm, selectedLetter, sortOrder]);
  
  // Function to export glossary terms
  const exportGlossary = () => {
    const glossaryText = terms.map((term: GlossaryTermType) => 
      `${term.term}\n${term.definition}\n\n`
    ).join('');
    
    const blob = new Blob([glossaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nalt-glossary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Glossary Exported",
      description: "The glossary has been downloaded as a text file.",
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B387A]">Legal Citation Glossary</h2>
          </div>
          <p className="text-gray-600 mb-6">Browse or search terminology related to legal citation and research methodology in Nigeria.</p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center bg-white hover:bg-gray-50 text-[#294D98] border-gray-200"
                onClick={exportGlossary}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Terms
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center bg-white hover:bg-gray-50 text-[#294D98] border-gray-200"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrder === 'asc' ? 'Sort Z-A' : 'Sort A-Z'}
              </Button>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 hidden md:inline">
                {terms.length} terms in database
              </span>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="mb-5">
              <h3 className="text-lg font-medium text-[#1B387A] mb-2">Search Glossary</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter term or definition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Search by term name or definition content. Press Enter to search.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#1B387A] mb-3">Browse by Letter</h3>
              <AlphabetFilter 
                selectedLetter={selectedLetter}
                onSelectLetter={(letter) => {
                  setSelectedLetter(letter);
                  setSearchTerm(''); // Clear search when selecting a letter
                }}
              />
            </div>
          </div>
          
          {/* Term List with Loading State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1B387A]">
                  {debouncedSearchTerm ? "Search Results" : selectedLetter ? `Terms: ${selectedLetter}` : "All Terms"}
                </h3>
                <div className="h-1 w-24 bg-[#C3CDE1] rounded mt-2"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredAndSortedTerms.length} {filteredAndSortedTerms.length === 1 ? 'term' : 'terms'} found
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#294D98]" />
                <span className="ml-2 text-[#294D98]">Loading glossary terms...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center rounded-lg border border-dashed border-red-200 bg-red-50">
                <p className="text-red-600 mb-3">Error loading glossary terms.</p>
                <Button 
                  variant="outline" 
                  className="bg-white"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredAndSortedTerms.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredAndSortedTerms.map((term: GlossaryTermType) => (
                  <GlossaryTerm 
                    key={term.id}
                    id={term.id}
                    term={term.term}
                    definition={term.definition}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-3">No terms found for this selection.</p>
                <p className="text-gray-500">Try changing your filters or selecting a different letter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Term Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Glossary Term</DialogTitle>
            <DialogDescription>
              Add a new term and definition to the glossary.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-term">Term</Label>
              <Input
                id="new-term"
                value={newTerm.term}
                onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                placeholder="e.g., Ratio Decidendi"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-definition">Definition</Label>
              <Textarea
                id="new-definition"
                value={newTerm.definition}
                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                placeholder="Enter a clear, concise definition of the term..."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="sm:w-auto w-full order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#294D98] hover:bg-[#1B387A] sm:w-auto w-full order-1 sm:order-2"
              onClick={handleAddTerm}
              disabled={addTermMutation.isPending}
            >
              {addTermMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Add Term
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
