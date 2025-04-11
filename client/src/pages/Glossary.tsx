import { useState } from 'react';
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
import { glossaryTerms } from '@/lib/data';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('A');
  
  // Filter terms based on search, category, and selected letter
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesLetter = term.term.charAt(0).toUpperCase() === selectedLetter;
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Legal Citation Glossary</h2>
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
          
          {/* Term List */}
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-[#1B387A] border-b-2 border-[#C3CDE1] pb-2 mb-4">{selectedLetter}</h3>
            
            {filteredTerms.length > 0 ? (
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
                <p className="text-gray-600">No terms found for this selection. Try changing your filters.</p>
              </div>
            )}
          </div>
          
          {/* Pagination - Static for now */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">Previous</a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-[#1B387A] text-white">1</a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</a>
              <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">4</a>
              <a href="#" className="px-3 py-2 border-t border-b border-r border-gray-300 bg-white text-gray-700 hover:bg-gray-50">5</a>
              <a href="#" className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">Next</a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
