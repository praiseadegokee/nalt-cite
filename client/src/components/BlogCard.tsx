import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.style.display = 'none';
    
    // Create fallback element
    const fallback = document.createElement('div');
    fallback.className = 'h-48 w-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'text-center text-white';
    iconDiv.innerHTML = `
      <svg class="h-8 w-8 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-xs opacity-80">Article</p>
    `;
    
    fallback.appendChild(iconDiv);
    img.parentNode?.insertBefore(fallback, img);
  };

  return (
    <article className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail image */}
      <div className="relative overflow-hidden">
        {(post as any).thumbnail ? (
          <img 
            src={(post as any).thumbnail} 
            alt={post.title}
            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center">
            <div className="text-center text-white">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-60" />
              <p className="text-xs opacity-80">Article</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          <time 
            className="text-xs text-gray-500 flex items-center"
            dateTime={post.date}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
        
        {/* Title */}
        <Link href={`/blog/${post.id}`} className="block group/title">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover/title:text-[#294D98] transition-colors duration-200">
            {post.title}
            <ArrowRight className="inline-block h-4 w-4 ml-1 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200" />
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Author and Read Time */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center min-w-0 flex-1 mr-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#294D98] to-[#1B387A] flex items-center justify-center mr-3 flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">{post.author}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
            <Clock className="h-3 w-3 mr-1" />
            <span className="whitespace-nowrap">{post.readTime} min</span>
          </div>
        </div>
      </div>
    </article>
  );
}
