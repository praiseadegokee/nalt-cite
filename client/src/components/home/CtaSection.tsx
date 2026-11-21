import { Link } from 'wouter';
import { Download, ArrowRight, ShieldCheck, Scale, Sparkles } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1c3877] to-[#0f2047] text-white relative overflow-hidden border-t border-[#0f2047]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
        <div className="text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-blue-100">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Accurate • Consistent • Academic Standard</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Ready to perfect your Nigerian legal citations?
          </h2>

          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-sans">
            Whether preparing moot court briefs, LL.B. long essays, law review manuscripts, or appellate submissions, NALT Cite ensures every citation passes judicial and academic scrutiny.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-2 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-xs font-semibold text-blue-200 mb-1">Dual Output</div>
              <p className="text-xs text-blue-100/70">
                Switch between footnote citations and inverted bibliography entries with one click.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-xs font-semibold text-blue-200 mb-1">RAG Grounded</div>
              <p className="text-xs text-blue-100/70">
                AI answers strictly grounded in official NALT 2021 Bluebook and OSCOLA guides.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-xs font-semibold text-blue-200 mb-1">Export Ready</div>
              <p className="text-xs text-blue-100/70">
                Download formatted Word documents with hanging indents or copy BibTeX keys.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
            <Link href="/citation-generator">
              <a className="inline-flex items-center justify-center gap-2 bg-white text-[#1c3877] hover:bg-slate-100 font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all duration-150">
                <Scale className="h-4 w-4 text-[#1c3877]" />
                <span>Launch Citation Generator</span>
                <ArrowRight className="h-4 w-4 text-[#1c3877]/60" />
              </a>
            </Link>

            <Link href="/chat">
              <a className="inline-flex items-center justify-center gap-2 bg-[#0f2047]/80 hover:bg-[#0f2047] text-white border border-white/20 font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all duration-150">
                <Sparkles className="h-4 w-4 text-blue-300" />
                <span>Consult NALT AI Assistant</span>
              </a>
            </Link>
          </div>

          <div className="pt-4 text-xs text-blue-200/60">
            Official Nigerian Association of Law Teachers Uniform Format & Citation Guide for Legal Research Writing in Nigeria.
          </div>

        </div>
      </div>
    </section>
  );
}
