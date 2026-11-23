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
import { 
  Search, 
  HelpCircle, 
  ChevronLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-blue-100 text-[#1c3877] font-semibold px-1 rounded">$1</mark>');
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<string | null>("item-0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  const { 
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery<FaqCategory[]>({
    queryKey: ['/api/faq/categories'],
    retry: 1,
  });

  const { 
    data: faqItems = [],
    isLoading: faqItemsLoading,
  } = useQuery<FAQItem[]>({
    queryKey: ['/api/faq/items'],
    retry: 1,
  });

  const groupedFaqItems = faqItems.reduce((groups: Record<number, FAQItem[]>, item: FAQItem) => {
    if (!groups[item.categoryId]) {
      groups[item.categoryId] = [];
    }
    groups[item.categoryId].push(item);
    return groups;
  }, {} as Record<number, FAQItem[]>);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "General Legal Rules";
  };

  const getFilteredItems = () => {
    let results = [...faqItems];
    
    if (selectedCategory !== "all") {
      results = results.filter(item => 
        item.categoryId === parseInt(selectedCategory)
      );
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.question.toLowerCase().includes(term) || 
        item.answer.toLowerCase().includes(term)
      );
    }
    
    results.sort((a, b) => {
      if (a.categoryId !== b.categoryId) {
        return a.categoryId - b.categoryId;
      }
      return a.order - b.order;
    });
    
    return results;
  };

  const handleCopyFAQ = async (item: FAQItem) => {
    try {
      const cleanAnswer = item.answer.replace(/<[^>]*>/g, '').trim();
      const text = `Q: ${item.question}\n\nA: ${cleanAnswer}\n\n(Source: NALT Uniform Format and Citation Guide 2021)`;
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      toast({
        title: "Answer Copied",
        description: "Rule explanation copied to clipboard.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const filteredItems = getFilteredItems();
  const isLoading = categoriesLoading || faqItemsLoading;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-[#1c3877] text-white rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Official Rules Repository</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
              NALT Citation Rules & Frequently Asked Questions
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans">
              Authoritative answers covering Nigerian case law abbreviations, statutory citation, unreported decisions, electronic databases, and dissertation formatting according to the NALT Uniform Format Guide (2021 Series No. 2).
            </p>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none font-serif text-[180px] font-black select-none leading-none">
            §
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search legal citation questions (e.g., 'unreported case', 'statute', 'initials', 'NWLR')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-10 py-3 bg-white border border-slate-300 rounded-xl shadow-xs text-sm focus-visible:ring-1 focus-visible:ring-[#1c3877] focus-visible:border-[#1c3877]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
          
          {searchTerm && (
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between px-1">
              <span>
                Found <strong className="text-slate-800">{filteredItems.length}</strong> matching questions for "<span className="text-[#1c3877]">{searchTerm}</span>"
              </span>
              <button onClick={() => setSearchTerm('')} className="underline text-slate-600 hover:text-[#1c3877]">
                Reset search
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Desktop Grid: Category Index (4 cols) & Accordion Q&A (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Category Sidebar */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="px-2 py-2 border-b border-slate-100 mb-2 flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-slate-900 uppercase tracking-wider">
                  Rule Categories
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {faqItems.length} Total
                </span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-[#1c3877] text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-[#1c3877]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>All Questions</span>
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    selectedCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {faqItems.length}
                  </span>
                </button>

                {categories.map((category) => {
                  const count = groupedFaqItems[category.id]?.length || 0;
                  const isSelected = selectedCategory === category.id.toString();
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-between ${
                        isSelected
                          ? "bg-[#1c3877] text-white shadow-xs font-semibold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-[#1c3877]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-2">
                        <FolderOpen className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{category.name}</span>
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant Callout Box */}
            <div className="bg-[#0f2047] text-white rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Need Instant Answers?</span>
              </div>
              <p className="text-xs text-blue-100/80 leading-relaxed font-sans">
                Cannot find your exact citation dilemma in the FAQ list? The NALT AI Assistant has ingested the complete 2021 Bluebook.
              </p>
              <Link href="/chat">
                <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-lg border border-white/15 transition-colors">
                  <span>Open NALT AI Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Link>
            </div>
          </div>

          {/* Right Column: Q&A Accordion Items */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Category Subhead */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-base font-serif font-bold text-slate-900">
                  {selectedCategory === "all" ? "All Legal Citation Questions" : getCategoryName(parseInt(selectedCategory))}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredItems.length} question{filteredItems.length !== 1 ? 's' : ''}
                </p>
              </div>

              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-xs text-[#1c3877] hover:underline font-semibold"
                >
                  View all categories
                </button>
              )}
            </div>

            {/* Questions Stream */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 animate-pulse space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-800">No Matching Questions Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms or browse another category.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="text-xs"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <Accordion 
                type="single" 
                collapsible 
                value={openItem ?? undefined}
                onValueChange={(val) => setOpenItem(val)}
                className="space-y-3"
              >
                {filteredItems.map((item) => {
                  const isCopied = copiedId === item.id;
                  const questionHtml = highlightText(item.question, searchTerm);
                  const answerHtml = highlightText(item.answer, searchTerm);

                  return (
                    <AccordionItem 
                      key={item.id}
                      value={`item-${item.id}`}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <AccordionTrigger className="px-5 py-4 text-left hover:no-underline hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-start gap-3 pr-4 text-left">
                          <span className="w-5 h-5 rounded bg-slate-100 text-[#1c3877] text-xs font-serif font-bold flex items-center justify-center shrink-0 mt-0.5">
                            Q
                          </span>
                          <div>
                            <div 
                              className="text-sm font-semibold text-slate-900 leading-snug font-sans"
                              dangerouslySetInnerHTML={{ __html: questionHtml }}
                            />
                            {selectedCategory === "all" && (
                              <span className="inline-block mt-1 text-[11px] text-slate-400 font-medium">
                                Category: {getCategoryName(item.categoryId)}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40">
                        {/* Answer Body - Clean Justified Academic Prose */}
                        <div className="py-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-justify space-y-2">
                          <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
                        </div>

                        {/* Card Action Footnote */}
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>NALT Uniform Format Standard</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyFAQ(item);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
