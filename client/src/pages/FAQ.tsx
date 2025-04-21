import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { FAQ as FAQItem, FaqCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, ChevronLeft, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Helper function to highlight matching text
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

export default function FAQPage() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<string | null>("item-0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();

  // Data fetching with TanStack Query
  const { 
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery<FaqCategory[]>({
    queryKey: ['/api/faq/categories'],
    retry: 1,
  });

  const { 
    data: faqItems = [],
    isLoading: faqItemsLoading,
    error: faqItemsError
  } = useQuery<FAQItem[]>({
    queryKey: ['/api/faq/items'],
    retry: 1,
  });

  // Group FAQ items by category for sidebar display
  const groupedFaqItems = faqItems.reduce((groups: Record<number, FAQItem[]>, item: FAQItem) => {
    if (!groups[item.categoryId]) {
      groups[item.categoryId] = [];
    }
    groups[item.categoryId].push(item);
    return groups;
  }, {} as Record<number, FAQItem[]>);

  // Get category name helper
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
  // Filter items based on search and category selection
  // Computing this during render instead of using useEffect + state to avoid infinite loops
  const getFilteredItems = () => {
    let results = [...faqItems];
    
    // Filter by category if not 'all'
    if (selectedCategory !== "all") {
      results = results.filter(item => 
        item.categoryId === parseInt(selectedCategory)
      );
    }
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.question.toLowerCase().includes(term) || 
        item.answer.toLowerCase().includes(term)
      );
    }
    
    // Sort results by category and then by order
    results.sort((a, b) => {
      if (a.categoryId !== b.categoryId) {
        return a.categoryId - b.categoryId;
      }
      return a.order - b.order;
    });
    
    return results;
  };
  
  // Handler for copying FAQ content
  const handleCopyFAQ = (question: string, answer: string) => {
    // Strip HTML tags for plain text copy
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = answer;
    const plainTextAnswer = tempDiv.textContent || tempDiv.innerText || "";
    
    const textToCopy = `Q: ${question}\nA: ${plainTextAnswer}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "FAQ content copied successfully",
          duration: 3000,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  // Calculate filtered items for display
  const filteredItems = getFilteredItems();

  // Loading state
  if (categoriesLoading || faqItemsLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl"></div>
          <div className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-indigo-100/20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-40 rounded-full mx-auto mb-6" />
              <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-6 w-2/4 mx-auto" />
            </div>
            
            <Skeleton className="h-14 max-w-2xl mx-auto rounded-xl mb-12" />
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100/50">
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
                {/* Category Sidebar Loading */}
                <div className="md:col-span-3 lg:col-span-3 bg-gradient-to-b from-[#1B387A]/5 to-transparent p-5 md:p-6">
                  <Skeleton className="h-8 w-32 mb-6" />
                  
                  <div className="space-y-3 pr-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                  </div>
                </div>
                
                {/* FAQ Content Loading */}
                <div className="md:col-span-9 lg:col-span-9 p-5 md:p-8">
                  <Skeleton className="h-8 w-48 mb-8" />
                  
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="border border-blue-100/50 rounded-xl overflow-hidden shadow-sm p-6 bg-white">
                          <Skeleton className="h-6 w-full mb-3" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (categoriesError || faqItemsError) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-100/30 blur-3xl"></div>
          <div className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-orange-100/20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-red-500/10 px-5 py-2 rounded-full mb-4 shadow-sm">
                <span className="text-red-600 font-medium tracking-wide">Error</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-600">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                We encountered an issue while loading the FAQ content. Please try again later.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-red-100 p-8 md:p-10 text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-red-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">There was an error loading the FAQ content</h3>
              <p className="text-gray-600 mb-8">Our team has been notified of this issue. Please try again later or contact support if the problem persists.</p>
              <Button 
                variant="outline" 
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 px-6 py-6 rounded-xl transition-all duration-300"
                onClick={() => window.location.reload()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-indigo-100/20 blur-3xl"></div>
      </div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(#1B387A 0.8px, transparent 0.8px)", 
          backgroundSize: "30px 30px" 
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#1B387A]/10 px-5 py-2 rounded-full mb-4 shadow-sm">
              <span className="text-[#1B387A] font-medium tracking-wide">Knowledge Base</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1B387A] via-[#2c4da3] to-[#3a61cc]">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Find answers to common questions about NALT citation format and legal research standards. Browse categories or search for specific topics.
            </p>
          </div>
          
          {/* Search - Enhanced with animation and styling */}
          <div className="relative mb-12 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
            <div className="relative shadow-lg rounded-xl overflow-hidden border border-blue-100/50">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B387A]/5 to-blue-50/50 opacity-70"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1B387A]/70" size={20} />
              <Input
                type="text"
                placeholder="Search for questions or answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border-0 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-[#1B387A]/30 rounded-xl w-full text-gray-700 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1B387A]/60 hover:text-[#1B387A] bg-white/80 rounded-full p-1 transition-colors duration-200"
                  onClick={() => setSearchTerm('')}
                >
                  <ChevronLeft size={18} />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>
            
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-100/50 shadow-sm">
                {filteredItems.length === 0 ? (
                  <p className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    No results found for "<span className="font-medium text-[#1B387A]">{searchTerm}</span>"
                  </p>
                ) : (
                  <p className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Found <span className="font-medium text-[#1B387A] mx-1">{filteredItems.length}</span> 
                    result{filteredItems.length !== 1 ? 's' : ''} for "<span className="font-medium text-[#1B387A]">{searchTerm}</span>"
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* FAQ Content Container - Redesigned with improved visuals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-100/50">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
              {/* Category Sidebar - Enhanced with better spacing and visuals */}
              <div className="md:col-span-3 lg:col-span-3 bg-gradient-to-b from-[#1B387A]/5 to-transparent p-5 md:p-6">
                <h3 className="font-semibold text-lg mb-5 text-[#1B387A] flex items-center">
                  <span className="h-6 w-1 bg-[#1B387A] rounded-full mr-2"></span>
                  Categories
                </h3>
                
                <div className="space-y-2 pr-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      selectedCategory === "all" 
                        ? "bg-[#1B387A] text-white shadow-lg" 
                        : "text-gray-700 hover:bg-[#1B387A]/10 hover:translate-x-1"
                    }`}
                  >
                    <span className="font-medium">All Questions</span>
                    <Badge variant={selectedCategory === "all" ? "secondary" : "outline"} 
                      className={`${
                        selectedCategory === "all"
                          ? "bg-white/20 text-white border-white/10" 
                          : "bg-[#1B387A]/10 text-[#1B387A] border-[#1B387A]/20"
                      }`}
                    >
                      {faqItems.length}
                    </Badge>
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                        selectedCategory === category.id.toString() 
                          ? "bg-[#1B387A] text-white shadow-lg" 
                          : "text-gray-700 hover:bg-[#1B387A]/10 hover:translate-x-1"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <Badge variant={selectedCategory === category.id.toString() ? "secondary" : "outline"} 
                        className={`${
                          selectedCategory === category.id.toString()
                            ? "bg-white/20 text-white border-white/10" 
                            : "bg-[#1B387A]/10 text-[#1B387A] border-[#1B387A]/20"
                        }`}
                      >
                        {groupedFaqItems[category.id]?.length || 0}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* FAQ Content - Enhanced with better spacing, animations and styling */}
              <div className="md:col-span-9 lg:col-span-9 p-5 md:p-8">
                <div className="flex items-center mb-6">
                  <h3 className="font-semibold text-xl text-[#1B387A] flex-1">
                    {selectedCategory === "all" 
                      ? "All Questions" 
                      : getCategoryName(parseInt(selectedCategory))}
                  </h3>
                  
                  {filteredItems.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium text-[#1B387A]">{filteredItems.length}</span> question{filteredItems.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                      <HelpCircle size={36} className="text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-3">No FAQ items found</h4>
                    <p className="text-gray-500 max-w-md">
                      {searchTerm
                        ? `No results match your search for "${searchTerm}". Try using different keywords or browse categories.`
                        : "There are no FAQ items in this category yet."}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        className="mt-6 rounded-xl px-6 hover:bg-[#1B387A]/5 border-[#1B387A]/20 text-[#1B387A]"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                    <Accordion 
                      type="single" 
                      collapsible 
                      value={openItem ?? undefined}
                      onValueChange={(value) => setOpenItem(value)}
                      className="space-y-4"
                    >
                      {filteredItems.map((item, index) => {
                        // Prepare highlighted content if searching
                        const questionContent = searchTerm
                          ? highlightText(item.question, searchTerm)
                          : item.question;
                        
                        const answerContent = searchTerm
                          ? highlightText(item.answer, searchTerm)
                          : item.answer;
                        
                        // Add staggered animation delay based on index
                        const animationDelay = `${index * 50}ms`;
                        
                        return (
                          <AccordionItem 
                            key={item.id}
                            value={`item-${item.id}`}
                            className="border border-blue-100/50 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group"
                            style={{ animationDelay }}
                          >
                            <AccordionTrigger 
                              className="flex justify-between items-start w-full px-6 py-5 text-left bg-white hover:bg-blue-50/50 focus:outline-none text-gray-900 transition-colors duration-200"
                            >
                              <div className="pr-8">
                                {selectedCategory === "all" && (
                                  <Badge 
                                    variant="secondary" 
                                    className="mb-2 text-xs bg-[#1B387A]/10 text-[#1B387A] border-none"
                                  >
                                    {getCategoryName(item.categoryId)}
                                  </Badge>
                                )}
                                <div 
                                  className="font-medium text-lg group-hover:text-[#1B387A] transition-colors duration-200"
                                  dangerouslySetInnerHTML={{ __html: questionContent }}
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-5 bg-gradient-to-br from-blue-50/50 to-white border-t border-blue-100/50 text-gray-700">
                              <div className="prose prose-sm max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: answerContent }} />
                              </div>
                              <div className="mt-6 flex justify-end border-t border-blue-100/30 pt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-[#1B387A]/70 hover:text-[#1B387A] hover:bg-[#1B387A]/5 border-[#1B387A]/20 rounded-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyFAQ(item.question, item.answer);
                                  }}
                                >
                                  <Copy size={14} className="mr-2" />
                                  Copy Answer
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Card - Enhanced with better design and animation */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#172B5E] via-[#1B387A] to-[#294D98] rounded-2xl transform rotate-1 opacity-70 blur-sm"></div>
            <div className="bg-gradient-to-r from-[#172B5E] via-[#1B387A] to-[#294D98] text-white rounded-2xl shadow-xl overflow-hidden relative z-10">
              <div className="p-8 md:p-10 text-center md:flex md:items-center md:text-left">
                <div className="md:flex-1">
                  <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                  <p className="opacity-90 text-lg max-w-xl">
                    Contact our support team for specific questions about NALT citation format or legal research standards.
                  </p>
                </div>
                <div className="mt-6 md:mt-0 md:ml-6 flex justify-center">
                  <Button 
                    className="bg-white text-[#1B387A] hover:bg-blue-50 border-none shadow-lg px-6 py-6 rounded-xl text-lg font-medium transition-transform duration-300 hover:scale-105"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
