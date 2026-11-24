import { cn } from '@/lib/utils';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function AlphabetFilter({ selectedLetter, onSelectLetter }: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center sm:justify-start">
      <button
        className={cn(
          "px-3 h-8 sm:h-9 flex items-center justify-center rounded-lg transition-all text-xs font-semibold",
          selectedLetter === ''
            ? "bg-[#1c3877] text-white shadow-xs" 
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        )}
        onClick={() => onSelectLetter('')}
        aria-pressed={selectedLetter === ''}
      >
        All
      </button>

      {alphabet.map(letter => {
        const isSelected = selectedLetter === letter;
        return (
          <button 
            key={letter}
            className={cn(
              "w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg transition-all text-xs font-semibold",
              isSelected
                ? "bg-[#1c3877] text-white shadow-xs" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
  );
}
