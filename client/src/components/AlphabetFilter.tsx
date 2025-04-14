import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  availableLetters?: string[]; // Optional: Only highlight letters that have available terms
  showAll?: boolean; // Optional: Include "All" option
}

export default function AlphabetFilter({ 
  selectedLetter, 
  onSelectLetter,
  availableLetters,
  showAll = false
}: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile view based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Create a compact display for mobile that shows a subset of the alphabet
  const mobileAlphabet = isMobile && !isExpanded 
    ? [selectedLetter, ...alphabet.filter(l => l !== selectedLetter).slice(0, 9)] 
    : alphabet;
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-1 justify-center">
        {showAll && (
          <motion.span 
            key="all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 h-8 flex items-center justify-center rounded ${
              selectedLetter === '' 
                ? 'bg-[#1B387A] text-white' 
                : 'bg-gray-200 hover:bg-[#1B387A] hover:text-white'
            } font-medium cursor-pointer`}
            onClick={() => onSelectLetter('')}
          >
            All
          </motion.span>
        )}
        
        <AnimatePresence>
          {mobileAlphabet.map(letter => {
            const isAvailable = !availableLetters || availableLetters.includes(letter);
            
            return (
              <motion.span 
                key={letter}
                initial={isMobile && !isExpanded ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: isAvailable ? 1.05 : 1 }}
                whileTap={{ scale: isAvailable ? 0.95 : 1 }}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  selectedLetter === letter 
                    ? 'bg-[#1B387A] text-white' 
                    : isAvailable
                      ? 'bg-gray-200 hover:bg-[#1B387A] hover:text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } font-medium cursor-pointer`}
                onClick={() => isAvailable && onSelectLetter(letter)}
              >
                {letter}
              </motion.span>
            );
          })}
        </AnimatePresence>
        
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium cursor-pointer ml-1"
          >
            {isExpanded ? 'Less' : 'More'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
