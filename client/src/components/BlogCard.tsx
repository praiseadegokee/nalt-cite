import { Link } from 'wouter';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-48 w-full bg-gray-300"></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium py-1 px-2 rounded bg-[#C3CDE1]/40 text-[#1B387A]">{post.category}</span>
          <time className="text-xs text-gray-500" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </div>
        <Link href={`/blog/${post.id}`} className="block text-lg font-semibold text-gray-900 hover:underline mb-2">
          {post.title}
        </Link>
        <p className="text-gray-600 text-sm">{post.excerpt}</p>
        <div className="mt-4 flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-sm font-medium text-gray-900">{post.author}</span>
        </div>
      </div>
    </div>
  );
}
