import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c3877]/10 text-[#1c3877] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Writing Platform</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Complete Legal Research & Citation Suite
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Built specifically to uphold the official Nigerian Association of Law Teachers Uniform Format across case law, statutory provisions, dissertations, and law journals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title} 
              description={feature.description} 
              icon={feature.icon} 
              link={feature.link} 
              linkText={feature.linkText} 
            />
          ))}
        </div>

        {/* Academic Standard Bar */}
        <div className="mt-14 p-6 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1c3877] text-white flex items-center justify-center font-serif font-bold text-base shrink-0">
              §
            </div>
            <div>
              <div className="font-semibold text-slate-900">NALT Uniform Format & Citation Guide (2021 Series No. 2)</div>
              <div className="text-slate-500">Adopted by Nigerian law faculties, the Nigerian Law School, and Nigerian law reviews.</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800">100% Rules Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
}
