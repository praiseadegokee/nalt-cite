import { Link } from 'wouter';
import { Download, Plus } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B387A] to-[#294D98] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-40 h-40 rounded-full bg-white blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-white/90 font-medium">Get Started Today</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to perfect your legal citations?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">Download the complete NALT Citation Guide and start citing with confidence. Access the tools Nigerian legal professionals trust.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="/api/downloads/complete-guide" 
              className="bg-white text-[#1B387A] font-bold py-4 px-8 rounded-lg hover:bg-[#C3CDE1] transition duration-200 shadow-lg flex items-center justify-center"
              download
            >
              <Download className="h-5 w-5 mr-2" />
              Download Complete Guide
            </a>
            <Link href="/citation-generator">
              <span className="bg-transparent text-white font-bold py-4 px-8 rounded-lg border-2 border-white hover:bg-white/10 transition duration-200 flex items-center justify-center cursor-pointer">
                <Plus className="h-5 w-5 mr-2" />
                Try Citation Generator
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}