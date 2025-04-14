import { cn } from '@/lib/utils';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function AlphabetFilter({ selectedLetter, onSelectLetter }: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="flex flex-wrap gap-1.5 justify-center px-1">
      {alphabet.map(letter => {
        const isSelected = selectedLetter === letter;
        
        return (
          <button 
            key={letter}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-md transition-all",
              "text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#294D98]",
              isSelected
                ? "bg-[#294D98] text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => onSelectLetter(letter)}
            aria-pressed={isSelected}
            aria-label={`Filter by letter ${letter}`}
          >
            {letter}
          </button>
        );
      })}
      
      <button
        className={cn(
          "w-auto px-3 h-9 flex items-center justify-center rounded-md transition-all ml-1",
          "text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#294D98]",
          selectedLetter === 'ALL'
            ? "bg-[#294D98] text-white shadow-sm" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
        onClick={() => onSelectLetter('')}
        aria-pressed={selectedLetter === ''}
        aria-label="Show all letters"
      >
        All
      </button>
    </div>
  );
}
