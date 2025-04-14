import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AlphabetFilter from '@/components/AlphabetFilter';
import GlossaryTerm from '@/components/GlossaryTerm';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Set up debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch data from API
  const { data: terms = [], isLoading, isError } = useQuery({
    queryKey: ['/api/glossary', selectedLetter, selectedCategory, debouncedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (selectedLetter) {
        params.append('letter', selectedLetter);
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
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
  
  // Filtered terms (client-side filtering as backup if server filtering is incomplete)
  const filteredTerms = terms.filter((term: GlossaryTermType) => {
    const matchesSearch = debouncedSearchTerm ? 
      (term.term.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
       term.definition.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) : true;
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesLetter = !selectedLetter || term.term.charAt(0).toUpperCase() === selectedLetter.toUpperCase();
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B387A]">Legal Citation Glossary</h2>
            <Link href="/glossary/add">
              <Button className="bg-[#294D98] hover:bg-[#1B387A]">
                Add New Term
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 mb-8">Browse or search terminology related to legal citation and research methodology in Nigeria.</p>
          
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="legal">Legal Term</SelectItem>
                  <SelectItem value="citation">Citation Term</SelectItem>
                  <SelectItem value="research">Research Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Alphabet Filter */}
          <AlphabetFilter 
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
          />
          
          {/* Term List with Loading State */}
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-[#1B387A] border-b-2 border-[#C3CDE1] pb-2 mb-4">{selectedLetter}</h3>
            
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
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredTerms.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTerms.map((term: GlossaryTermType, index: number) => (
                  <GlossaryTerm 
                    key={index}
                    term={term.term}
                    definition={term.definition}
                    category={term.category}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No terms found for this selection. Try changing your filters or add a new term.</p>
                <Link href="/glossary/add">
                  <Button variant="outline" className="mt-4">
                    Add New Term
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Pagination removed for now since API doesn't support it yet */}
        </div>
      </div>
    </section>
  );
}
