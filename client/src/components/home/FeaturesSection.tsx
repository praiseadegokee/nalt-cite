import { Link } from 'wouter';
import { 
  Sparkles, 
  Scale, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  BookmarkCheck, 
  Library, 
  HelpCircle, 
  Newspaper, 
  FolderDown, 
  Compass,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#1c3877] font-semibold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#1c3877]"></span>
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              The NALT Legal Research Ecosystem
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Purpose-built tooling designed specifically for Nigerian legal academia, appellate submissions, and judicial writing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NALT 2021 Series No. 2 Certified</span>
          </div>
        </div>

        {/* PRIMARY WORKSTATIONS: 2 Flagship Hero Cards (Generator & AI Assistant) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Workstation 1: Citation Generator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#1c3877]/10 text-[#1c3877] flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1c3877] border border-blue-100">
                  Core Engine
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                  Interactive Citation Generator
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  Generate instant, validated NALT citations for Nigerian reported cases (NWLR, All NLR), unreported decisions, federal and state statutes, and academic publications.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-time Live Preview</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Footnote & Biblio Inversion</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Word (.doc) Hanging Indents</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>BibTeX Academic Export</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">13+ Source Archetypes</span>
              <Link href="/citation-generator">
                <a className="inline-flex items-center gap-2 bg-[#1c3877] hover:bg-[#0f2047] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs">
                  <span>Launch Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Link>
            </div>
          </div>

          {/* Workstation 2: NALT Research Studio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#0f2047] text-white flex items-center justify-center font-serif font-bold text-lg">
                  §
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Grounded RAG
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                  AI Legal Consultation & RAG Studio
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  Query the official NALT Uniform Format Guide (2021) and OSCOLA (4th Ed) manuals directly. Retrieve precise rule interpretations, paragraph cross-references, and style solutions.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct PDF Chunk Grounding</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero Hallucination Retrieval</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Formatted Legal Markdown</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multi-Turn Research History</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Gemini 2.0 Flash RAG</span>
              <Link href="/chat">
                <a className="inline-flex items-center gap-2 bg-[#0f2047] hover:bg-[#1c3877] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs">
                  <span>Open Research Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Link>
            </div>
          </div>

        </div>

        {/* SUPPORTING KNOWLEDGE & REFERENCE ARCHIVE (4 Balanced Academic Cards) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Knowledge Base & Reference Archives
            </h4>
            <span className="text-xs text-slate-500">Curated for law faculties & legal researchers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Archive 1: Legal Glossary */}
            <Link href="/glossary">
              <a className="p-5 bg-white border border-slate-200 rounded-xl hover:border-[#1c3877]/60 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group h-full">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#1c3877] group-hover:bg-[#1c3877] group-hover:text-white transition-colors flex items-center justify-center">
                    <Library className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                      Legal Glossary
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      123 authoritative definitions spanning Latin maxims, citation abbreviations, and procedural terminology.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#1c3877]">
                  <span>Search Glossary</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </Link>

            {/* Archive 2: FAQ Repository */}
            <Link href="/faq">
              <a className="p-5 bg-white border border-slate-200 rounded-xl hover:border-[#1c3877]/60 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group h-full">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#1c3877] group-hover:bg-[#1c3877] group-hover:text-white transition-colors flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                      Rules & FAQ Database
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      171 categorized answers addressing recurring formatting hurdles in Nigerian cases, statutes, and treaties.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#1c3877]">
                  <span>Explore FAQs</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </Link>

            {/* Archive 3: Legal Writing Blog */}
            <Link href="/blog">
              <a className="p-5 bg-white border border-slate-200 rounded-xl hover:border-[#1c3877]/60 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group h-full">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#1c3877] group-hover:bg-[#1c3877] group-hover:text-white transition-colors flex items-center justify-center">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                      Scholarship & Blog
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      26 analytical articles covering Nigerian dissertation structure, OSCOLA comparisons, and legal writing tips.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#1c3877]">
                  <span>Read Articles</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </Link>

            {/* Archive 4: Downloadable Manuals */}
            <Link href="/resources">
              <a className="p-5 bg-white border border-slate-200 rounded-xl hover:border-[#1c3877]/60 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group h-full">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#1c3877] group-hover:bg-[#1c3877] group-hover:text-white transition-colors flex items-center justify-center">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors">
                      Guides & Resources
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Download complete official PDFs, referencing cheat sheets, and style templates for offline academic study.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#1c3877]">
                  <span>Access Resources</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </Link>

          </div>
        </div>

        {/* Institutional Accreditation Footnote Banner */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-serif text-xl font-bold text-blue-200 shrink-0">
              §
            </div>
            <div>
              <div className="text-sm font-serif font-bold tracking-wide">
                NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Formally sanctioned by the Nigerian Association of Law Teachers (NALT) to establish uniform academic standards across all 50+ Nigerian faculties of law.
              </p>
            </div>
          </div>

          <a 
            href="/api/downloads/complete-guide"
            download="NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors border border-white/15 shrink-0"
          >
            <FolderDown className="w-4 h-4 text-blue-200" />
            <span>Download Guide PDF</span>
          </a>
        </div>

      </div>
    </section>
  );
}
