import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { FAQ as FAQItem, FaqCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<string | null>("item-0");

  // Fetch FAQ categories
  const { 
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['/api/faq/categories'],
    retry: 1,
  });

  // Fetch FAQ items
  const { 
    data: faqItems,
    isLoading: faqItemsLoading,
    error: faqItemsError
  } = useQuery({
    queryKey: ['/api/faq/items'],
    retry: 1,
  });

  // Group FAQ items by category
  const groupedFaqItems = faqItems ? faqItems.reduce((groups: Record<number, FAQItem[]>, item: FAQItem) => {
    if (!groups[item.categoryId]) {
      groups[item.categoryId] = [];
    }
    groups[item.categoryId].push(item);
    return groups;
  }, {}) : {};

  // Filter FAQ items based on selected category
  const filteredFaqItems = selectedCategory === "all" 
    ? faqItems
    : faqItems?.filter((item: FAQItem) => item.categoryId === parseInt(selectedCategory));

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat: FaqCategory) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Loading state
  if (categoriesLoading || faqItemsLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-8" />
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (categoriesError || faqItemsError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Frequently Asked Questions</h2>
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              <p>There was an error loading the FAQ content. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-8">Find answers to common questions about NALT citation format and legal research standards.</p>
          
          {/* Category Tabs */}
          {categories && categories.length > 0 && (
            <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
              <TabsList className="mb-6 flex flex-wrap border-b border-gray-200 pb-1 w-full justify-start">
                <TabsTrigger
                  value="all"
                  className="px-4 py-2 -mb-px rounded-t-lg data-[state=active]:text-[#1B387A] data-[state=active]:border-b-2 data-[state=active]:border-[#1B387A]"
                >
                  All Questions
                </TabsTrigger>
                
                {categories.map((category: FaqCategory) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id.toString()}
                    className="px-4 py-2 -mb-px rounded-t-lg data-[state=active]:text-[#1B387A] data-[state=active]:border-b-2 data-[state=active]:border-[#1B387A]"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                <Accordion 
                  type="single" 
                  collapsible 
                  value={openItem ?? undefined}
                  onValueChange={(value) => setOpenItem(value)}
                  className="space-y-4"
                >
                  {faqItems && faqItems.map((item: FAQ, index: number) => (
                    <AccordionItem 
                      key={item.id}
                      value={`item-${item.id}`}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none font-medium text-gray-900">
                        <div>
                          <span className="text-sm text-[#1B387A] font-normal block mb-1">{getCategoryName(item.categoryId)}</span>
                          {item.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              {categories.map((category: FaqCategory) => (
                <TabsContent key={category.id} value={category.id.toString()}>
                  <Accordion 
                    type="single" 
                    collapsible 
                    value={openItem ?? undefined}
                    onValueChange={(value) => setOpenItem(value)}
                    className="space-y-4"
                  >
                    {groupedFaqItems[category.id]?.map((item: FAQ) => (
                      <AccordionItem 
                        key={item.id}
                        value={`item-${item.id}`}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none font-medium text-gray-900">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                          <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          )}
          
          {/* More Questions */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Still have questions about NALT citation format?</p>
            <Button className="inline-block mt-4 bg-[#1B387A] hover:bg-[#294D98] text-white font-medium py-2 px-6 rounded-md transition duration-150">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
