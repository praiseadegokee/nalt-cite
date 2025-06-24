import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Clock, 
  User, 
  Calendar,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Check
} from 'lucide-react';
import { useState } from 'react';

export default function BlogPost() {
  const { id } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);
  
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.style.display = 'none';
    
    const fallback = document.createElement('div');
    fallback.className = 'h-64 w-full bg-gradient-to-br from-[#294D98] to-[#1B387A] mb-8 rounded-xl flex items-center justify-center text-white';
    fallback.innerHTML = `
      <div class="text-center">
        <svg class="h-12 w-12 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-sm opacity-80">Article Image</p>
      </div>
    `;
    
    img.parentNode?.insertBefore(fallback, img);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post?.title || '');

  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/blog">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Return to blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <article className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back to blog link */}
            <Button variant="ghost" asChild className="mb-8 hover:bg-white/50">
              <Link href="/blog">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to all articles
              </Link>
            </Button>
            
            {/* Article header */}
            <header className="mb-8 sm:mb-12 bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <Badge variant="default" className="bg-[#294D98] hover:bg-[#1B387A] text-xs">
                  {post.category}
                </Badge>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {post.readTime} min read
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{post.author}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Contributing Author</p>
                  </div>
                </div>
                
                {/* Share buttons */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="hover:bg-gray-50 p-2"
                  >
                    {copiedLink ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-blue-50 p-2"
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-blue-50 p-2"
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-blue-50 p-2"
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </header>
            
            {/* Article content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Thumbnail image */}
              {(post as any).thumbnail ? (
                <img 
                  src={(post as any).thumbnail} 
                  alt={post.title}
                  className="h-48 sm:h-64 lg:h-80 w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="h-48 sm:h-64 lg:h-80 w-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center text-white">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-60" />
                    <p className="text-xs sm:text-sm opacity-80">Featured Article</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                  <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium leading-relaxed mb-6 sm:mb-8">
                    {post.excerpt}
                  </p>
                  
                  <div 
                    className="prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#294D98] hover:prose-a:text-[#1B387A] prose-img:rounded-lg prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Tags section */}
            {post.tags && (
              <div className="mt-8 bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let tagsArray: string[] = [];
                    
                    if (post.tags) {
                      try {
                        if (typeof post.tags === 'string') {
                          if (post.tags.startsWith('[')) {
                            tagsArray = JSON.parse(post.tags);
                          } else {
                            tagsArray = post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
                          }
                        } else if (Array.isArray(post.tags)) {
                          tagsArray = post.tags;
                        }
                      } catch (e) {
                        console.error('Failed to parse tags', e);
                        if (typeof post.tags === 'string') {
                          tagsArray = post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
                        }
                      }
                    }
                    
                    if (!Array.isArray(tagsArray)) {
                      tagsArray = [];
                    }
                    
                    return tagsArray.length > 0 ? tagsArray.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="hover:bg-[#294D98] hover:text-white transition-colors cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    )) : (
                      <span className="text-sm text-gray-500">No tags available</span>
                    );
                  })()}
                </div>
              </div>
            )}
            
            {/* Back to blog CTA */}
            <div className="mt-12 text-center">
              <Separator className="mb-8" />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Explore More Articles</h3>
                <p className="text-gray-600">Discover more insights on legal citation and academic writing</p>
                <Button asChild size="lg" className="bg-[#294D98] hover:bg-[#1B387A]">
                  <Link href="/blog">
                    View All Articles
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
