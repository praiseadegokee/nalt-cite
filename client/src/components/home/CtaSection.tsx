import { Link } from 'wouter';
import { Download, Plus, CheckCircle, ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#172B5E] via-[#1B387A] to-[#294D98] text-white relative overflow-hidden">
      {/* Top curved edge */}
      <div className="absolute top-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-20 fill-current text-white transform -translate-y-19 rotate-180">
          <path d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
        </svg>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-20 left-1/3 w-64 h-64 rounded-full bg-blue-300/10 blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-indigo-300/10 blur-3xl animate-pulse" style={{ animationDuration: '18s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-300/10 blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>
      
      {/* Animated glass planes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-16 bg-white/5 -rotate-3 backdrop-blur-sm"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-24 bg-white/5 rotate-2 backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 md:p-16 border border-white/20 shadow-xl">
            <div className="text-center mb-12">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6 shadow-lg border border-white/30">
                <span className="text-white font-medium tracking-wide">Get Started Today</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to perfect your legal citations?
              </h2>
              
              <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Download the complete NALT Citation Guide and start citing with confidence. 
                Access the tools Nigerian legal professionals trust for accurate legal citations.
              </p>
              
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  'Instant access to citation formats',
                  'Comprehensive examples for all sources',
                  'Updated for latest legal standards'
                ].map((benefit, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-200 mt-0.5 flex-shrink-0" />
                      <p>{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href="/api/downloads/complete-guide" 
                  className="bg-white text-[#1B387A] font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl flex items-center justify-center group border border-white/80"
                  download
                >
                  <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Download Complete Guide</span>
                </a>
                <Link href="/citation-generator">
                  <span className="bg-blue-600/40 hover:bg-blue-600/50 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl border border-white/30 transition-all duration-300 shadow-xl flex items-center justify-center cursor-pointer group">
                    <span>Try Citation Generator</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 items-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm text-white/80">Nigerian Law Schools Approved</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm text-white/80">Used by 2,000+ Legal Professionals</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm text-white/80">Updated 2023 Standards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}