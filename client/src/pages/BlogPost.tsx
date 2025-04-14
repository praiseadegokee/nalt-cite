import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';

export default function BlogPost() {
  const { id } = useParams();
  
  // Fetch blog post from the API
  const { data: post, isLoading, isError } = useQuery({
    queryKey: [`/api/blog/posts/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${id}`);
      if (!response.ok) {
        throw new Error('Post not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Loading article...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-20 text-center">
        <p>Article not found.</p>
        <Link href="/blog">
          <a className="inline-block mt-4 text-[#294D98] hover:underline">
            Return to blog
          </a>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back to blog link */}
          <Link href="/blog" className="inline-flex items-center text-[#294D98] hover:text-[#1B387A] mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all articles
          </Link>
          
          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-xs font-medium py-1 px-2 rounded bg-[#C3CDE1]/40 text-[#1B387A] mr-3">{post.category}</span>
              <time dateTime={post.date} className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.readTime} min read</p>
              </div>
            </div>
          </header>
          
          {/* Article content */}
          <div className="prose max-w-none">
            <div className="h-64 w-full bg-gray-300 mb-8 rounded"></div>
            
            <p className="text-lg font-medium text-gray-800 mb-6">{post.excerpt}</p>
            
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Tags */}
          {post.tags && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Related Topics:</h2>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  let tagsArray: string[] = [];
                  try {
                    // Try to parse the tags if they're stored as a JSON string
                    if (typeof post.tags === 'string') {
                      tagsArray = JSON.parse(post.tags);
                    } else if (Array.isArray(post.tags)) {
                      tagsArray = post.tags;
                    }
                  } catch (e) {
                    console.error('Failed to parse tags', e);
                  }
                  
                  return tagsArray.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="text-xs font-medium py-1 px-2 rounded-full bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ));
                })()}
              </div>
            </div>
          )}
          
          {/* Share links */}
          <div className="mt-8 flex justify-end">
            <div className="flex space-x-4">
              <button className="text-sm text-[#294D98] hover:text-[#1B387A]">Share on Twitter</button>
              <button className="text-sm text-[#294D98] hover:text-[#1B387A]">Share on LinkedIn</button>
              <button className="text-sm text-[#294D98] hover:text-[#1B387A]">Share on Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
