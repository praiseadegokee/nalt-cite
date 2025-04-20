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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-5 w-full mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-3">
                <Skeleton className="h-12 w-full mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))}
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Frequently Asked Questions</h2>
            <div className="text-red-500 p-6 bg-red-50 rounded-lg shadow-sm">
              <p className="font-medium">There was an error loading the FAQ content.</p>
              <p className="mt-2">Please try again later or contact support if the problem persists.</p>
              <Button 
                variant="outline" 
                className="mt-4 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1B387A]">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about NALT citation format and legal research standards. Browse categories or search for specific topics.
            </p>
          </div>
          
          {/* Search */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for questions or answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#1B387A] focus:ring-[#1B387A] rounded-lg w-full"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <ChevronLeft size={18} />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>
            
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-500">
                {filteredItems.length === 0 ? (
                  <p>No results found for "{searchTerm}"</p>
                ) : (
                  <p>Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchTerm}"</p>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {/* Category Sidebar */}
              <div className="md:col-span-1 bg-gray-50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="font-medium text-lg mb-4 text-[#1B387A]">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === "all" 
                        ? "bg-[#1B387A] text-white" 
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Questions
                    <Badge variant="outline" className="ml-2 bg-white text-[#1B387A] border-[#1B387A]">
                      {faqItems.length}
                    </Badge>
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id.toString() 
                          ? "bg-[#1B387A] text-white" 
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                      <Badge variant="outline" className={`ml-2 ${
                        selectedCategory === category.id.toString()
                          ? "bg-white text-[#1B387A] border-white" 
                          : "bg-white text-[#1B387A] border-[#1B387A]"
                      }`}>
                        {groupedFaqItems[category.id]?.length || 0}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* FAQ Content */}
              <div className="md:col-span-3 p-4 md:p-6">
                <h3 className="font-medium text-xl mb-5 text-[#1B387A]">
                  {selectedCategory === "all" 
                    ? "All Questions" 
                    : getCategoryName(parseInt(selectedCategory))}
                </h3>
                
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <HelpCircle size={48} className="text-gray-300 mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No FAQ items found</h4>
                    <p className="text-gray-500 max-w-md">
                      {searchTerm
                        ? `No results match your search for "${searchTerm}". Try using different keywords or browse categories.`
                        : "There are no FAQ items in this category yet."}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                    <Accordion 
                      type="single" 
                      collapsible 
                      value={openItem ?? undefined}
                      onValueChange={(value) => setOpenItem(value)}
                      className="space-y-4"
                    >
                      {filteredItems.map((item) => {
                        // Prepare highlighted content if searching
                        const questionContent = searchTerm
                          ? highlightText(item.question, searchTerm)
                          : item.question;
                        
                        const answerContent = searchTerm
                          ? highlightText(item.answer, searchTerm)
                          : item.answer;
                        
                        return (
                          <AccordionItem 
                            key={item.id}
                            value={`item-${item.id}`}
                            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"
                          >
                            <AccordionTrigger className="flex justify-between items-start w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none text-gray-900">
                              <div className="pr-8">
                                {selectedCategory === "all" && (
                                  <Badge variant="secondary" className="mb-2 text-xs font-normal">
                                    {getCategoryName(item.categoryId)}
                                  </Badge>
                                )}
                                <div 
                                  className="font-medium"
                                  dangerouslySetInnerHTML={{ __html: questionContent }}
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                              <div className="prose prose-sm max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: answerContent }} />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyFAQ(item.question, item.answer);
                                  }}
                                >
                                  <Copy size={14} className="mr-1" />
                                  Copy
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
          
          {/* Contact Card */}
          <div className="mt-12 bg-[#1B387A] text-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
              <p className="mb-6 opacity-90">Contact us for specific questions about NALT citation format or legal research.</p>
              <Button 
                className="bg-white text-[#1B387A] hover:bg-gray-100 border-none"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
