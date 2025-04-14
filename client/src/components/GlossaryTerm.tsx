import { useState } from 'react';
import { motion } from 'framer-motion';

interface GlossaryTermProps {
  term: string;
  definition: string;
}

export default function GlossaryTerm({ term, definition }: GlossaryTermProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if the definition is longer than 150 characters
  const isLongDefinition = definition.length > 150;
  const displayDefinition = isLongDefinition && !isExpanded 
    ? `${definition.substring(0, 150)}...` 
    : definition;
  
  return (
    <motion.div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition cursor-pointer"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => isLongDefinition && setIsExpanded(!isExpanded)}
    >
      <h4 className="font-bold text-[#294D98] mb-1">{term}</h4>
      <p className="text-gray-700">{displayDefinition}</p>
      
      {isLongDefinition && (
        <button 
          className="text-sm text-[#294D98] mt-2 hover:underline focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </motion.div>
  );
}
