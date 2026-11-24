import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Search, 
  Filter, 
  CheckSquare, 
  Copy, 
  Video, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  FileCheck2,
  BookmarkCheck,
  FolderDown,
  Layers
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resources, guidelineParts } from '@/lib/data';
import { Resource } from '@/lib/types';
import { Link } from 'wouter';
import mockupCoverImg from '@/assets/mockup-cover.png';

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'all' | 'citation' | 'templates' | 'checklists' | 'tutorials'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Complete guide (first item) and individual parts
  const completeGuide = guidelineParts[0];
  const parts = guidelineParts.slice(1);

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'citation', name: 'Citation Guides', count: resources.filter(r => r.category === 'citation').length },
    { id: 'templates', name: 'Academic Templates', count: resources.filter(r => r.category === 'templates').length },
    { id: 'checklists', name: 'Proofreading Checklists', count: resources.filter(r => r.category === 'checklists').length },
    { id: 'tutorials', name: 'Video Tutorials', count: resources.filter(r => r.category === 'tutorials').length },
  ];

  const filteredResources = resources.filter(item => {
    const matchesCat = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (res: Resource, idx: number) => {
    setDownloadingId(`res-${idx}`);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Editorial Banner */}
        <div className="bg-[#1c3877] text-white rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Official Academic Repository • NALT 2021 Series No. 2</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
              NALT Guidelines & Research Resources
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans max-w-2xl">
              Download the official Nigerian Association of Law Teachers Uniform Format manual, pre-formatted Word dissertation templates, comparison cheat sheets, and proofreading checklists.
            </p>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none font-serif text-[180px] font-black select-none leading-none">
            §
          </div>
        </div>

        {/* SECTION 1: Flagship Guide Download Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-serif font-bold text-slate-900 uppercase tracking-wider">
                Official Reference Publication
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                Uniform Format and Citation Guide for Legal Research Writing in Nigeria
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Current 2021 Series Edition</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Book Preview Column */}
            <div className="lg:col-span-4 flex justify-center bg-slate-50/70 p-8 rounded-xl border border-slate-100">
              <img 
                src={mockupCoverImg} 
                alt="NALT Citation Guide Manual"
                className="w-48 sm:w-56 h-auto drop-shadow-xl rounded transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>

            {/* Guide Details Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed font-sans text-justify">
                  The definitive, nationally approved referencing manual developed by the Nigerian Association of Law Teachers (NALT) to establish uniform citation across Nigerian law faculties, the Nigerian Law School, and academic legal publishing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Standardized abbreviations for Nigerian Weekly Law Reports (NWLR), All NLR, and Supreme Court citations.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Prescribed chapter divisions and page lengths for LL.B. long essays, LL.M. dissertations, and Ph.D. theses.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exact footnote rules, quotation indentation, and bibliography author inversion conventions.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Section-by-section breakdown for law review and academic journal article submissions.</span>
                  </div>
                </div>
              </div>

              {/* Download Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a 
                  href="/api/downloads/complete-guide" 
                  download="NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf"
                  className="inline-flex items-center gap-2 bg-[#1c3877] hover:bg-[#0f2047] text-white text-xs font-semibold px-5 py-3 rounded-lg shadow-xs transition-colors"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>Download Complete Guide (Full PDF)</span>
                </a>

                <Link href="/citation-generator">
                  <a className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-3 rounded-lg transition-colors">
                    <span>Use Interactive Generator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Sectional Breakdown Grid */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Individual Guideline Parts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {parts.map((part) => (
                <div key={part.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-7 h-7 rounded bg-[#1c3877]/10 text-[#1c3877] font-serif font-bold text-xs flex items-center justify-center mb-2">
                      §
                    </div>
                    <h4 className="text-xs font-serif font-bold text-slate-900 leading-snug">
                      {part.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {part.description}
                    </p>
                  </div>
                  <a 
                    href="/api/downloads/complete-guide"
                    download={`${part.filename}.pdf`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1c3877] hover:underline pt-2 border-t border-slate-200/60"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Section PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Templates & Checklists Library */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-serif font-bold text-slate-900 uppercase tracking-wider">
                Support Materials & Tooling
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Academic Templates, Checklists & Media
              </h2>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-white text-xs rounded-lg border-slate-300"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`px-3.5 py-2 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === cat.id
                    ? 'bg-[#1c3877] text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Resources Cards Grid */}
          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">No Resources Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No files match your search criteria. Try clearing the search bar.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="text-xs"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res, idx) => {
                const isDownloading = downloadingId === `res-${idx}`;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#1c3877]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#1c3877] border border-blue-100">
                          {res.category}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 font-semibold uppercase">
                          {res.type} {res.size ? `• ${res.size}` : ''}
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-[#1c3877] transition-colors leading-snug">
                        {res.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify">
                        {res.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {res.type === 'video' ? (
                        <a
                          href={res.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#1c3877] hover:bg-[#0f2047] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Watch Video Tutorial</span>
                          <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                        </a>
                      ) : (
                        <a
                          href={res.downloadUrl}
                          download
                          onClick={() => handleDownload(res, idx)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#1c3877] text-slate-800 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors group-hover:bg-[#1c3877] group-hover:text-white"
                        >
                          {isDownloading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              <span>Preparing...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download {res.type.toUpperCase()}</span>
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: Bottom Assistance Banner */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-serif text-2xl font-bold text-blue-200 shrink-0">
              §
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-white">
                Need Help Applying NALT Rules to Your Specific Case?
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                The NALT AI Legal Assistant is grounded in the full text of both the NALT 2021 Bluebook and OSCOLA 4th Edition. Ask any referencing question directly.
              </p>
            </div>
          </div>

          <Link href="/chat">
            <a className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1c3877] hover:bg-blue-900 text-xs font-semibold text-white transition-colors border border-white/10 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Open Research Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </Link>
        </div>

      </div>
    </div>
  );
}
