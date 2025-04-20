import { Link } from 'wouter';
import { BlogPost } from '@/lib/types';
import { Calendar, ChevronRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col h-full border border-gray-100">
      {/* Image Area */}
      <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B387A]/0 to-[#1B387A]/20 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium py-1 px-2.5 rounded-full bg-[#C3CDE1]/40 text-[#1B387A] hover:bg-[#C3CDE1]/60 transition-colors">
            {post.category}
          </span>
          <time 
            className="text-xs text-gray-500 flex items-center" 
            dateTime={post.date}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </time>
        </div>
        
        {/* Title */}
        <Link href={`/blog/${post.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1B387A] transition-colors duration-300 mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
        
        {/* Author and Read More */}
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
              {/* Author avatar placeholder */}
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[150px]">
              {post.author}
            </span>
          </div>
          
          <Link href={`/blog/${post.id}`}>
            <span className="text-sm text-[#1B387A] font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
              Read
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
