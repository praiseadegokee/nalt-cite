import { Link } from 'wouter';
import { Download, Sparkles, ShieldCheck, Scale, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import mockupCoverImg from '@/assets/mockup-cover.png';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#0f2047] via-[#1c3877] to-[#1c3877] text-white pt-16 pb-24 md:pt-20 md:pb-28 relative overflow-hidden border-b border-[#0f2047]">
      {/* Subtle architectural grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-7xl mx-auto">
          
          {/* Main Editorial Copy */}
          <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-blue-100 backdrop-blur-xs shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Official Reference standard • NALT Series 2021 No. 2</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-bold tracking-tight text-white leading-[1.15]">
              Nigerian Association of Law Teachers Citation Guide
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              The authoritative referencing manual and AI research studio for legal scholars, bar aspirants, and legal practitioners across Nigeria. Complete NALT Bluebook, OSCOLA alignment, and automated formatting.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Supreme Court & NWLR citation formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant Footnote & Bibliography inversion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Official PDF manuals ingested into RAG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Export directly to Word & BibTeX</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 pt-4">
              <Link href="/citation-generator">
                <a className="inline-flex items-center justify-center gap-2 bg-white text-[#1c3877] hover:bg-slate-100 font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all duration-150">
                  <Scale className="h-4 w-4 text-[#1c3877]" />
                  <span>Open Citation Generator</span>
                  <ArrowRight className="h-4 w-4 text-[#1c3877]/60" />
                </a>
              </Link>

              <Link href="/chat">
                <a className="inline-flex items-center justify-center gap-2 bg-[#0f2047]/80 hover:bg-[#0f2047] text-white border border-white/20 font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all duration-150">
                  <Sparkles className="h-4 w-4 text-blue-300" />
                  <span>NALT AI Research Studio</span>
                </a>
              </Link>
            </div>

            {/* Quick download link */}
            <div className="text-xs text-blue-200/70 pt-1">
              Need the offline guide?{' '}
              <a 
                href="/api/downloads/complete-guide" 
                className="text-white underline hover:text-blue-100 font-medium"
                download="NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf"
              >
                Download Official NALT Guide (PDF)
              </a>
            </div>

          </div>

          {/* Book Mockup / Interactive Authority Card */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="relative max-w-sm sm:max-w-md w-full">
              
              {/* Subtle back ambient card */}
              <div className="bg-white/5 border border-white/15 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                  <span className="font-serif font-bold text-blue-200 uppercase tracking-wider text-[11px]">
                    Uniform Format Edition
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    2021 Series
                  </span>
                </div>

                <div className="py-6 flex justify-center">
                  <img 
                    src={mockupCoverImg} 
                    alt="NALT Uniform Format and Citation Guide" 
                    className="w-48 sm:w-56 h-auto drop-shadow-2xl rounded shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                {/* Live sample citation banner inside card */}
                <div className="bg-[#0f2047]/80 border border-white/10 rounded-lg p-3 text-left space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                    <span>Sample Citation Standard</span>
                    <span className="text-emerald-400 font-mono">Reported Case</span>
                  </div>
                  <div className="text-xs font-serif text-white break-words">
                    <em>Fawehinmi v. Abacha</em> [1996] 9 NWLR (Pt. 475) 710
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
