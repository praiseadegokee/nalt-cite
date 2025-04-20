import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function AlphabetFilter({ selectedLetter, onSelectLetter }: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Scroll to selected letter
  useEffect(() => {
    if (selectedLetter && scrollContainerRef.current) {
      const selectedButton = scrollContainerRef.current.querySelector(`[data-letter="${selectedLetter}"]`) as HTMLElement;
      if (selectedButton) {
        const scrollContainer = scrollContainerRef.current;
        const selectedRect = selectedButton.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // Calculate if the selected button is out of view
        if (selectedRect.left < containerRect.left || selectedRect.right > containerRect.right) {
          // Calculate the scroll position to center the selected button
          const scrollLeft = selectedButton.offsetLeft - (scrollContainer.offsetWidth / 2) + (selectedButton.offsetWidth / 2);
          scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  }, [selectedLetter]);
  
  // Check scroll position to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px threshold
    }
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      handleScroll();
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative max-w-full">
      {/* Left scroll button */}
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md text-gray-700 hover:text-[#294D98] transition-all ${
          showLeftArrow ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-1.5 py-2 px-8 md:px-6 no-scrollbar scroll-smooth"
        onScroll={handleScroll}
      >
        {/* All button */}
        <button
          className={cn(
            "flex-shrink-0 min-w-9 h-9 px-3 flex items-center justify-center rounded-md transition-all",
            "text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#294D98]",
            selectedLetter === ''
              ? "bg-[#294D98] text-white shadow-sm" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          onClick={() => onSelectLetter('')}
          aria-pressed={selectedLetter === ''}
          aria-label="Show all letters"
          data-letter="ALL"
        >
          All
        </button>
        
        {/* Alphabet buttons */}
        {alphabet.map(letter => {
          const isSelected = selectedLetter === letter;
          
          return (
            <button 
              key={letter}
              data-letter={letter}
              className={cn(
                "flex-shrink-0 min-w-9 w-9 h-9 flex items-center justify-center rounded-md transition-all",
                "text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#294D98]",
                isSelected
                  ? "bg-[#294D98] text-white shadow-sm scale-110 z-10" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              )}
              onClick={() => onSelectLetter(letter)}
              aria-pressed={isSelected}
              aria-label={`Filter by letter ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
      
      {/* Right scroll button */}
      <button
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md text-gray-700 hover:text-[#294D98] transition-all ${
          showRightArrow ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
