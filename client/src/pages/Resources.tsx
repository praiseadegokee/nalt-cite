import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ResourceCard from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';
import { resources } from '@/lib/data';

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Fetch resources
  const { data: resourceItems, isLoading } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => {
      // In a real application, this would fetch from an API
      return resources;
    },
  });
  
  // Filter resources by category
  const filteredResources = resourceItems?.filter(resource => 
    activeCategory === 'all' || resource.category === activeCategory
  );

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'citation', name: 'Citation Guides' },
    { id: 'templates', name: 'Templates' },
    { id: 'checklists', name: 'Checklists' },
    { id: 'tutorials', name: 'Video Tutorials' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Resources</h2>
          <p className="text-gray-600 mb-8">Download templates, guides, and reference materials to assist with your legal writing and citation needs.</p>
          
          {/* Resource Categories */}
          <div className="mb-10">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                      activeCategory === category.id
                        ? 'border-[#1B387A] text-[#1B387A]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center">
              <p>Loading resources...</p>
            </div>
          ) : (
            <>
              {/* Resources Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources?.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="mt-10 text-center">
                <Button variant="outline" className="bg-white hover:bg-gray-50 text-[#1B387A] font-medium py-2 px-6 rounded-md border border-gray-300 transition duration-150">
                  Load More Resources
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
