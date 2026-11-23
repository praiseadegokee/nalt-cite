import { Link } from 'wouter';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#1c3877]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden h-full">
      {/* Thumbnail or Fallback */}
      <div className="relative overflow-hidden bg-slate-100 aspect-16/9">
        {(post as any).thumbnail ? (
          <img 
            src={(post as any).thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0f2047] to-[#1c3877] flex items-center justify-center text-white relative">
            <span className="font-serif text-4xl font-bold text-blue-200/25">§</span>
            <div className="absolute bottom-3 left-3 text-[10px] uppercase font-mono tracking-wider text-blue-200/80">
              {post.category}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#1c3877] border border-blue-100">
              {post.category}
            </span>
            <time dateTime={post.date} className="text-[11px] font-mono text-slate-400">
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          
          {/* Title */}
          <Link href={`/blog/${post.id}`}>
            <a className="block group/title">
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 line-clamp-2 group-hover/title:text-[#1c3877] transition-colors leading-snug">
                {post.title}
              </h3>
            </a>
          </Link>
          
          {/* Excerpt with text-justify */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 text-justify font-sans">
            {post.excerpt}
          </p>
        </div>
        
        {/* Author Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center min-w-0 mr-2">
            <div className="w-6 h-6 rounded-full bg-[#1c3877] text-white flex items-center justify-center text-[10px] font-bold font-serif mr-2 shrink-0">
              {post.author.charAt(0)}
            </div>
            <span className="font-medium text-slate-800 truncate text-[11px]">{post.author}</span>
          </div>
          <div className="flex items-center text-[11px] text-slate-400 shrink-0 font-mono">
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readTime} min</span>
          </div>
        </div>
      </div>
    </article>
  );
}
