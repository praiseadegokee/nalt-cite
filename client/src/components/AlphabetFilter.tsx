interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export default function AlphabetFilter({ selectedLetter, onSelectLetter }: AlphabetFilterProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="mb-8 flex flex-wrap gap-1 justify-center">
      {alphabet.map(letter => (
        <span 
          key={letter}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            selectedLetter === letter 
              ? 'bg-[#1B387A] text-white' 
              : 'bg-gray-200 hover:bg-[#1B387A] hover:text-white'
          } font-medium cursor-pointer`}
          onClick={() => onSelectLetter(letter)}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
