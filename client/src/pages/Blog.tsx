import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  Newspaper
} from 'lucide-react';
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
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="md:flex">
          <div className="md:w-5/12">
            <Skeleton className="h-64 w-full md:h-full min-h-[300px]" />
          </div>
          <div className="p-8 md:w-7/12 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center space-x-3 pt-4">
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
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Editorial Header */}
        <div className="bg-[#1c3877] text-white rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>NALT Legal Research & Citation Scholarship</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
              Legal Insights & Scholarly Writing
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans max-w-2xl">
              In-depth articles, comparative analyses between NALT and foreign citation manuals (OSCOLA, APA, Bluebook), and best practices for Nigerian legal research dissertations.
            </p>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none font-serif text-[180px] font-black select-none leading-none">
            §
          </div>
        </div>

        {/* Search and Category Filter Station */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search across research articles, OSCOLA comparisons, case guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-slate-50 border-slate-200 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-[#1c3877]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider shrink-0 text-[11px] mr-1">
              Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === ''
                  ? 'bg-[#1c3877] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Topics ({posts?.length || 0})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#1c3877] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Featured Post Card (Hero Editorial) */}
            {featuredPost && !searchQuery && !selectedCategory && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#1c3877]/40 transition-all duration-200 group">
                <div className="lg:flex">
                  <div className="lg:w-5/12 relative bg-slate-100 min-h-[260px] overflow-hidden">
                    {(featuredPost as any).thumbnail ? (
                      <img 
                        src={(featuredPost as any).thumbnail} 
                        alt={featuredPost.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#0f2047] to-[#1c3877] flex flex-col items-center justify-center text-white p-8 text-center min-h-[260px]">
                        <span className="font-serif text-5xl font-bold text-blue-200/30 mb-2">§</span>
                        <div className="text-xs uppercase tracking-widest text-blue-200 font-semibold">Featured Scholarship</div>
                        <div className="text-sm text-white/80 font-serif mt-1">NALT Citation Review</div>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-[#1c3877] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      Lead Article
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10 lg:w-7/12 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#1c3877] border border-blue-100">
                          {featuredPost.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.id}`}>
                        <a className="block group/title">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 group-hover/title:text-[#1c3877] transition-colors leading-tight">
                            {featuredPost.title}
                          </h2>
                        </a>
                      </Link>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify font-sans line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1c3877] text-white flex items-center justify-center font-bold text-xs font-serif">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{featuredPost.author}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{featuredPost.readTime} min read</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/blog/${featuredPost.id}`}>
                        <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1c3877] group-hover:text-[#0f2047]">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {selectedCategory ? `Articles in ${selectedCategory}` : 'Recent Scholarly Articles'} ({filteredPosts.length})
                </h3>
              </div>

              {postsToShow.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsToShow.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {filteredPosts.length > 6 && (
                    <div className="text-center pt-6">
                      <Button
                        onClick={() => setShowAllPosts(!showAllPosts)}
                        variant="outline"
                        className="border-slate-300 text-slate-700 hover:text-[#1c3877] hover:bg-white text-xs font-semibold px-6 py-2 rounded-lg"
                      >
                        {showAllPosts ? 'Show Fewer Articles' : `View All ${filteredPosts.length} Articles`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-semibold text-slate-800">No Articles Match Your Search</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching for other terms like 'OSCOLA', 'statute', or 'dissertation'.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Clear Search & Filters
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
