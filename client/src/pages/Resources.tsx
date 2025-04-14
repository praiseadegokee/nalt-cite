import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ResourceCard from '@/components/ResourceCard';
import GuidelineDownloads from '@/components/GuidelineDownloads';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, Copy, Video, CheckSquare, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { resources } from '@/lib/data';
import Layout from '@/components/Layout';

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch resources
  const { data: resourceItems, isLoading, refetch } = useQuery({
    queryKey: ['/api/resources', activeCategory],
    queryFn: async () => {
      // In a real application, this would fetch from an API
      // with the category as a query parameter
      return resources;
    },
  });
  
  // Filter resources by category and search query
  const filteredResources = resourceItems?.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Resources', icon: FileText },
    { id: 'citation', name: 'Citation Guides', icon: FileText },
    { id: 'templates', name: 'Templates', icon: Copy },
    { id: 'checklists', name: 'Checklists', icon: CheckSquare },
    { id: 'tutorials', name: 'Video Tutorials', icon: Video },
  ];

  // Get counts for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return resourceItems?.length || 0;
    }
    return resourceItems?.filter(resource => resource.category === categoryId).length || 0;
  };

  return (
    <>
      {/* NALT Guidelines Section */}
      <GuidelineDownloads />
      
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary">Resource Library</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-3xl">
                Access our comprehensive collection of templates, guides, and reference materials to enhance your legal writing and citation practices.
              </p>
              
              {/* Search and filter bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => refetch()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
            
            {/* Resource Categories Tabs */}
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filter by category:</span>
              </div>
              
              <TabsList className="w-full md:w-auto grid-cols-2 md:grid-cols-5 grid lg:inline-flex h-auto gap-2 bg-transparent">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 px-4 py-2"
                  >
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                    <Badge variant="outline" className="ml-1 bg-white/10">
                      {getCategoryCount(category.id)}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <category.icon className="h-5 w-5 text-primary" />
                          {category.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {category.id === 'all' 
                            ? 'All resources available for download and reference' 
                            : `${category.name} to help with your legal citation needs`}
                        </p>
                      </div>
                      <Badge variant="outline" className="px-3 py-1 text-primary border-primary/30">
                        {filteredResources?.length || 0} {filteredResources?.length === 1 ? 'resource' : 'resources'}
                      </Badge>
                    </div>
                    
                    {isLoading ? (
                      <div className="py-16 text-center">
                        <div className="inline-block animate-spin mr-2">
                          <RefreshCw className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-gray-600 mt-2">Loading resources...</p>
                      </div>
                    ) : filteredResources?.length === 0 ? (
                      <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-700 mb-1">No resources found</h4>
                        <p className="text-gray-500">
                          {searchQuery 
                            ? `No results match your search "${searchQuery}"`
                            : 'There are no resources in this category yet'}
                        </p>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setSearchQuery('')}
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources?.map((resource, index) => (
                          <ResourceCard key={index} resource={resource} />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}