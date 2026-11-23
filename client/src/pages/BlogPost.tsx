import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  Clock, 
  User, 
  Calendar,
  Share2,
  Copy, 
  Check,
  ShieldCheck,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function BlogPost() {
  const { id } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();
  
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast({
        title: "Link Copied",
        description: "Article URL copied to clipboard.",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-20 bg-[#F8FAFC] min-h-screen text-center">
        <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-900">Article Not Found</h2>
          <p className="text-xs text-slate-500">The scholarly article you requested does not exist or has been moved.</p>
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c3877] text-white text-xs font-semibold rounded-lg">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation & Share action */}
        <div className="flex items-center justify-between">
          <Link href="/blog">
            <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1c3877] transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </a>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 text-xs font-medium border-slate-300 text-slate-700 hover:text-[#1c3877] gap-1.5"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Share Article</span>
              </>
            )}
          </Button>
        </div>

        {/* Article Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-[#1c3877] border border-blue-100">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <span className="text-xs text-slate-400">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-[#1c3877] text-white flex items-center justify-center font-serif font-bold text-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{post.author}</div>
              <div className="text-xs text-slate-500">NALT Legal Contributor</div>
            </div>
          </div>
        </div>

        {/* Lead Excerpt Banner - Justified */}
        <div className="bg-[#1c3877]/5 border-l-4 border-[#1c3877] p-5 sm:p-6 rounded-r-xl">
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans text-justify italic">
            "{post.excerpt}"
          </p>
        </div>

        {/* Article Body - Clean Academic Typography with full text-justify */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 shadow-xs">
          <div 
            className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-p:leading-relaxed prose-p:text-justify prose-li:text-slate-800 prose-li:text-justify prose-strong:text-slate-900 prose-a:text-[#1c3877] hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* Academic Source Note */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Complies with NALT Uniform Format and Citation Guide (2021)</span>
            </div>
            <Link href="/citation-generator">
              <a className="inline-flex items-center gap-1 text-[#1c3877] font-semibold hover:underline">
                <span>Try citing in NALT format</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
}
