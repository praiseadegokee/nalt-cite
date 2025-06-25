import { Link } from 'wouter';
import { Download, Plus, CheckCircle } from 'lucide-react';
import mockupCoverImg from '@/assets/mockup-cover.png';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-tr from-[#172B5E] via-[#1B387A] to-[#294D98] text-white py-24 md:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 -right-12 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent opacity-70 mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="md:w-7/12 lg:w-1/2 text-center md:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-white/20 shadow-lg">
              <span className="text-white/90 font-medium tracking-wide">Nigeria's Official Citation Guide</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-100">
              Nigerian Association of Law Teachers Citation Guide
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">The comprehensive resource for legal research and writing standards in Nigeria. Ensure your citations are accurate, consistent, and meet all academic requirements.</p>
            
            <div className="space-y-3 mb-10">
              {['Standardized citation formats', 'Comprehensive legal guidelines', 'Academic writing best practices'].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/85">
                  <CheckCircle className="h-5 w-5 text-blue-200" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 md:gap-6">
              <a 
                href="/api/downloads/complete-guide" 
                className="bg-white text-[#1B387A] font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg flex items-center justify-center group"
                download="NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf"
              >
                <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Download Complete Guide</span>
              </a>
              <Link href="/citation-generator">
                <span className="bg-blue-600/30 hover:bg-blue-600/40 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl border border-white/30 transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer group">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  <span>Generate Citation</span>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Book Mockup Image */}
          <div className="md:w-5/12 lg:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative perspective-1000">
              {/* Animated glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-2xl opacity-70 animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Book reflection/shadow */}
              <div className="absolute -bottom-12 w-full h-24 bg-black/20 blur-2xl rounded-full transform rotate-12 scale-75"></div>
              
              <img 
                src={mockupCoverImg} 
                alt="NALT Citation Guide Book Cover" 
                className="w-72 md:w-80 lg:w-96 relative z-10 drop-shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-1 rounded-sm"
              />
              
              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm transform rotate-12 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm animate-float" style={{ animationDuration: '6s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-20 fill-current text-gray-50 transform translate-y-1">
          <path d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
        </svg>
      </div>
    </section>
  );
}