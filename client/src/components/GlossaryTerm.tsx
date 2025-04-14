interface GlossaryTermProps {
  term: string;
  definition: string;
}

export default function GlossaryTerm({ term, definition }: GlossaryTermProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
      <h4 className="font-bold text-[#294D98] mb-1">{term}</h4>
      <p className="text-gray-700">{definition}</p>
    </div>
  );
}
