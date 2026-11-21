import { Link } from 'wouter';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkText: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  link,
  linkText
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#1c3877]/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-lg bg-[#1c3877]/10 text-[#1c3877] flex items-center justify-center mb-5 group-hover:bg-[#1c3877] group-hover:text-white transition-colors duration-200">
          <Icon className="h-6 w-6" />
        </div>
        
        <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-[#1c3877] transition-colors">
          {title}
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-sans">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <Link href={link}>
          <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1c3877] group-hover:text-[#0f2047] transition-colors">
            <span>{linkText}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </Link>
      </div>
    </div>
  );
}
