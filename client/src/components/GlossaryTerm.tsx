interface GlossaryTermProps {
  term: string;
  definition: string;
  category: string;
}

export default function GlossaryTerm({ term, definition, category }: GlossaryTermProps) {
  // Map category to display name
  const categoryDisplayMap: Record<string, string> = {
    'legal': 'Legal Term',
    'citation': 'Citation Term',
    'research': 'Research Term',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
      <h4 className="font-bold text-[#294D98] mb-1">{term}</h4>
      <p className="text-gray-700">{definition}</p>
      <span className="inline-block mt-2 text-xs font-medium py-1 px-2 rounded bg-[#C3CDE1]/40 text-[#1B387A]">
        {categoryDisplayMap[category] || category}
      </span>
    </div>
  );
}
