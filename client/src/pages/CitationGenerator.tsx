import React, { useEffect } from 'react';
import { CitationProvider, useCitation } from '@/context/CitationContext';
import { useCitationForm, CitationFormValues } from '@/hooks/citation/useCitationForm';
import CitationFormContainer from '@/components/citation/CitationFormContainer';
import CitationResult from '@/components/citation/CitationResult';
import { useSEO } from '@/hooks/use-seo';
import { ShieldCheck, BookOpen, Sparkles, Scale, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

function CitationGeneratorContent() {
  const { citation, bibliography, bibtex, isSubmitting, generateCitationFromData, updateLivePreview } = useCitation();
  const form = useCitationForm();
  
  // Watch all form changes for real-time live preview
  const watchedValues = form.watch();

  useEffect(() => {
    // Only update preview if sourceType is present
    if (watchedValues && watchedValues.sourceType) {
      updateLivePreview(watchedValues);
    }
  }, [JSON.stringify(watchedValues)]);

  async function onSubmit(data: CitationFormValues) {
    if (form.getValues('caseType') && !data.sourceType) {
      data.sourceType = 'case';
    }
    await generateCitationFromData(data);
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Editorial Banner */}
        <div className="bg-[#1c3877] text-white rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Official NALT Uniform Format Standard</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white">
              NALT Legal Citation Generator
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Generate precise footnotes, alphabetized bibliographies, and BibTeX entries formatted in accordance with the Nigerian Association of Law Teachers Uniform Format & Citation Guide (2021).
            </p>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none font-serif text-[180px] font-black select-none leading-none">
            §
          </div>
        </div>

        {/* 2-Column Responsive Layout: Inputs on Left, Dynamic Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <CitationFormContainer 
              form={form} 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting} 
            />

            {/* Quick Guide Footnote */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <BookOpen className="w-4 h-4 text-[#1c3877]" />
                <span>NALT Format At A Glance</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                <li><strong className="text-slate-800">Cases:</strong> Case names are italicized including <em>v.</em> e.g. <em>Fawehinmi v. Abacha</em> [1996] 9 NWLR (Pt. 475) 710.</li>
                <li><strong className="text-slate-800">Statutes:</strong> Title in regular roman font followed by Year and Chapter (Cap) designation.</li>
                <li><strong className="text-slate-800">Authors:</strong> Single author cited with First initial and Surname; 3+ authors use et al. or full listing in bibliography.</li>
              </ul>
              <div className="pt-2 border-t border-slate-100">
                <Link href="/chat">
                  <a className="inline-flex items-center gap-1 text-[#1c3877] font-semibold hover:underline">
                    <span>Need help with an unusual source? Ask the NALT AI Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Live Output & Export Station (5 cols on desktop, sticky on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
            <CitationResult 
              citation={citation} 
              bibliography={bibliography}
              bibtex={bibtex}
              isLivePreview={true}
            />

            {/* Quick Action Reference Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                  <Scale className="w-4 h-4 text-[#1c3877]" />
                  <span>Footnote vs Biblio</span>
                </div>
                <p className="text-slate-500 leading-normal">
                  Footnotes place authors in direct order; Bibliographies invert the primary author surname for alphabetical indexing.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Word & BibTeX</span>
                </div>
                <p className="text-slate-500 leading-normal">
                  Exports automatically apply 0.5-inch hanging indentations required for formal legal dissertations.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CitationGenerator() {
  useSEO({
    title: "NALT Citation Generator - Nigerian Legal Reference & Bibliography Tool",
    description: "Generate professional NALT-compliant citations, footnotes, and bibliographies for Nigerian cases, statutes, books, and law journals.",
    keywords: "NALT citation generator, Nigerian legal citations, NWLR case citation, statute citation, legal bibliography, NALT format",
    canonicalUrl: "https://naltcite.replit.app/citation-generator"
  });

  return (
    <CitationProvider>
      <CitationGeneratorContent />
    </CitationProvider>
  );
}
