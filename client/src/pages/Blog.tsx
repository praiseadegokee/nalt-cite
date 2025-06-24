import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, User, TrendingUp, Calendar } from 'lucide-react';
import { BlogPost } from '@/lib/types';

export default function Blog() {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Fetch blog posts from the API
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (posts && posts.length > 0) {
      setFeaturedPost(posts[0]);
      setRecentPosts(posts.slice(1));
    }
  }, [posts]);

  // Filter posts based on search and category
  const filteredPosts = recentPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(posts?.map((post: BlogPost) => post.category) || []));

  // Get posts to display
  const postsToShow = showAllPosts ? filteredPosts : filteredPosts.slice(0, 6);

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {/* Featured post skeleton */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5">
            <Skeleton className="h-64 w-full md:h-80" />
          </div>
          <div className="p-8 md:w-3/5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-[#294D98] mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B387A]">
                Legal Insights
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest insights on legal citation, research methodology, and academic writing from our experts.
            </p>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-2/5 relative">
                      {(featuredPost as any).thumbnail ? (
                        <img 
                          src={(featuredPost as any).thumbnail} 
                          alt={featuredPost.title}
                          className="h-64 w-full object-cover md:h-full"
                        />
                      ) : (
                        <div className="h-64 w-full bg-gradient-to-br from-[#294D98] to-[#1B387A] md:h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-60" />
                            <p className="text-sm opacity-80">Featured Article</p>
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-[#294D98] text-white">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-8 md:w-3/5">
                      <Badge variant="secondary" className="mb-3">
                        {featuredPost.category}
                      </Badge>
                      <Link href={`/blog/${featuredPost.id}`} className="block group">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-[#294D98] transition-colors duration-200 mb-4">
                          {featuredPost.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">{featuredPost.excerpt}</p>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900">{featuredPost.author}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <time dateTime={featuredPost.date}>
                              {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </time>
                            <span>•</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {featuredPost.readTime} min read
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search and Filter Bar */}
              <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                      className={selectedCategory === '' ? 'bg-[#294D98] hover:bg-[#1B387A]' : ''}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-[#294D98] hover:bg-[#1B387A]' : ''}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Articles Grid */}
              {postsToShow.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {postsToShow.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {filteredPosts.length > 6 && (
                    <div className="text-center">
                      <Button
                        onClick={() => setShowAllPosts(!showAllPosts)}
                        variant="outline"
                        size="lg"
                        className="border-[#294D98] text-[#294D98] hover:bg-[#294D98] hover:text-white"
                      >
                        {showAllPosts ? 'Show Less' : `View All ${filteredPosts.length} Articles`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
