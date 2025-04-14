import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/types';

export default function Blog() {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

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
      // Set the first post as featured
      setFeaturedPost(posts[0]);
      
      // Set the next 3 posts as recent
      setRecentPosts(posts.slice(1, 4));
    }
  }, [posts]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Latest Articles</h2>
          <p className="text-gray-600 mb-8">Stay updated with the latest insights on legal citation, research methodology, and academic writing.</p>
          
          {isLoading ? (
            <div className="py-20 text-center">
              <p>Loading blog posts...</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-2/5">
                      <div className="h-64 w-full bg-gray-300 md:h-full"></div>
                    </div>
                    <div className="p-6 md:p-8 md:w-3/5">
                      <div className="uppercase tracking-wide text-sm text-[#294D98] font-semibold">Featured Article</div>
                      <Link href={`/blog/${featuredPost.id}`} className="block mt-1 text-xl font-semibold text-gray-900 hover:underline">
                        {featuredPost.title}
                      </Link>
                      <p className="mt-3 text-gray-600">{featuredPost.excerpt}</p>
                      <div className="mt-4 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{featuredPost.author}</p>
                          <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={featuredPost.date}>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                            <span aria-hidden="true">&middot;</span>
                            <span>{featuredPost.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recent Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* View All Posts Button */}
              <div className="mt-12 text-center">
                <Button className="inline-block bg-[#294D98] hover:bg-[#1B387A] text-white font-medium py-2 px-6 rounded-md transition duration-150">
                  View All Articles
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
