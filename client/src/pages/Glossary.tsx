import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import AlphabetFilter from '@/components/AlphabetFilter';
import GlossaryTerm from '@/components/GlossaryTerm';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Loader2, 
  Search, 
  BookOpen, 
  X, 
  ArrowUpDown, 
  SortAsc, 
  SortDesc 
} from 'lucide-react';

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(''); // Changed to empty string to show all terms
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
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
  
  // Get a list of all available first letters for the terms
  const availableLetters = useMemo(() => {
    if (!terms || terms.length === 0) return [];
    const letters = new Set();
    terms.forEach((term: GlossaryTermType) => {
      if (term.term && term.term.length > 0) {
        letters.add(term.term.charAt(0).toUpperCase());
      }
    });
    return Array.from(letters) as string[];
  }, [terms]);
  
  // Filtered and sorted terms
  const filteredAndSortedTerms = useMemo(() => {
    // Filter terms
    const filtered = terms.filter((term: GlossaryTermType) => {
      const matchesSearch = debouncedSearchTerm ? 
        (term.term.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        term.definition.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) : true;
      const matchesLetter = !selectedLetter || term.term.charAt(0).toUpperCase() === selectedLetter.toUpperCase();
      
      return matchesSearch && matchesLetter;
    });
    
    // Sort terms
    return filtered.sort((a: GlossaryTermType, b: GlossaryTermType) => {
      if (sortDirection === 'asc') {
        return a.term.localeCompare(b.term);
      } else {
        return b.term.localeCompare(a.term);
      }
    });
  }, [terms, selectedLetter, debouncedSearchTerm, sortDirection]);

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.section 
      className="py-16 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-[#1B387A]"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Legal Citation Glossary
            </motion.h2>
          </div>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse or search terminology related to legal citation and research methodology in Nigeria.
          </motion.p>
          
          {/* Search and Filter */}
          <motion.div 
            className="mb-8 flex flex-col md:flex-row gap-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-grow relative">
              <div className="relative flex items-center">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <Input
                  type="text"
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 focus:ring-[#294D98] focus:border-[#294D98]"
                />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortDirection}
              className="hidden md:flex"
              title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
          
          {/* Alphabet Filter */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AlphabetFilter 
              selectedLetter={selectedLetter}
              onSelectLetter={setSelectedLetter}
              availableLetters={availableLetters}
              showAll={true}
            />
          </motion.div>
          
          {/* Term List with Loading State */}
          <motion.div 
            className="mb-8"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center border-b-2 border-[#C3CDE1] pb-2 mb-4">
              <h3 className="text-xl font-semibold text-[#1B387A]">
                {selectedLetter ? `Terms Starting with "${selectedLetter}"` : 'All Terms'}
              </h3>
              
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <BookOpen className="h-4 w-4" />
                <span>{filteredAndSortedTerms.length} term{filteredAndSortedTerms.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#294D98]" />
                <span className="ml-2 text-[#294D98]">Loading glossary terms...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center bg-white rounded-lg border border-red-200">
                <p className="text-red-600">Error loading glossary terms. Please try again.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
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
                    term={term.term}
                    definition={term.definition}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No terms found for this selection.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedLetter('');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
