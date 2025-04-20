import { Link } from 'wouter';
import { Download, Plus, Book, Archive, ScrollText, Check, ArrowRight } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1B387A] to-[#294D98] text-white py-16 md:py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-white transform translate-x-1/2"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-white"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Nigerian Association of Law Teachers Uniform Format and Citation Guide</h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-10 opacity-90">The comprehensive resource for legal research and writing standards in Nigeria</p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href="/api/downloads/complete-guide" 
                className="bg-white text-[#1B387A] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg flex items-center justify-center transform hover:scale-105"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                <span>Download Complete Guide</span>
              </a>
              <Link href="/citation-generator">
                <span className="bg-[#294D98] text-white font-bold py-3 px-6 rounded-lg border-2 border-white hover:bg-[#1B387A] transition duration-200 shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-105">
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Generate Citation</span>
                </span>
              </Link>
            </div>
            
            {/* Secondary Download Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-5 mx-auto max-w-md">
              <p className="mb-3 text-sm font-medium">Download Individual Parts:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <a href="/api/downloads/part1" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-md transition-all hover:shadow-md" download>Part 1</a>
                <a href="/api/downloads/part2" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-md transition-all hover:shadow-md" download>Part 2</a>
                <a href="/api/downloads/part3" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-md transition-all hover:shadow-md" download>Part 3</a>
                <a href="/api/downloads/part4" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded-md transition-all hover:shadow-md" download>Part 4</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1B387A]">Key Features</h2>
            <p className="text-gray-600">Discover the powerful tools and resources available to help you perfect your legal citations and research.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
                link={feature.link} 
                linkText={feature.linkText} 
                borderColor={index % 2 === 0 ? 'border-[#1B387A]' : 'border-[#294D98]'}
                iconBgColor={index % 2 === 0 ? 'bg-[#1B387A]/10' : 'bg-[#294D98]/10'}
                iconColor={index % 2 === 0 ? 'text-[#1B387A]' : 'text-[#294D98]'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - New! */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1B387A]">Why Use NALT Cite?</h2>
            <p className="text-gray-600">The benefits of using the standardized Nigerian Association of Law Teachers citation format</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-[#1B387A]/5 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="bg-[#1B387A] rounded-lg p-3 w-12 h-12 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-center md:text-left">Academic Excellence</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#1B387A] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Ensures consistency across all legal academic writing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#1B387A] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Improves the quality and credibility of legal research</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#1B387A] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Facilitates peer review and academic collaboration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-[#294D98]/5 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="bg-[#294D98] rounded-lg p-3 w-12 h-12 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                  <ScrollText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-center md:text-left">Professional Standards</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#294D98] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Recognized by courts and legal institutions across Nigeria</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#294D98] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Prepares students for professional legal practice</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#294D98] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Simplifies the process of legal publication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1B387A] to-[#294D98] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to perfect your legal citations?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Download the complete NALT Citation Guide and start citing with confidence using the standard recognized by legal professionals across Nigeria.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/api/downloads/complete-guide" 
                className="bg-white text-[#1B387A] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-lg flex items-center justify-center"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                Download Complete Guide
              </a>
              <Link href="/citation-generator">
                <span className="bg-transparent text-white font-bold py-3 px-6 rounded-lg border-2 border-white hover:bg-white/10 transition duration-200 cursor-pointer inline-flex items-center justify-center">
                  Try Citation Generator
                  <ArrowRight className="h-5 w-5 ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
