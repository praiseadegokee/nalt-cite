import { Link } from 'wouter';
import { Download, Plus } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1B387A] to-[#294D98] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Nigerian Association of Law Teachers Uniform Format and Citation Guide</h1>
            <p className="text-lg md:text-xl mb-10 opacity-90">The comprehensive resource for legal research and writing standards in Nigeria</p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <a 
                href="/api/downloads/complete-guide" 
                className="bg-white text-[#1B387A] font-bold py-3 px-6 rounded-lg hover:bg-[#C3CDE1] transition duration-200 shadow-lg flex items-center justify-center"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                Download Complete Guide
              </a>
              <Link href="/citation-generator">
                <span className="bg-[#294D98] text-white font-bold py-3 px-6 rounded-lg border-2 border-white hover:bg-[#1B387A] transition duration-200 shadow-lg flex items-center justify-center cursor-pointer">
                  <Plus className="h-5 w-5 mr-2" />
                  Generate Citation
                </span>
              </Link>
            </div>
            
            {/* Secondary Download Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 inline-block">
              <p className="mb-3 text-sm font-medium">Download Individual Parts:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <a href="/api/downloads/part1" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded transition" download>Part 1</a>
                <a href="/api/downloads/part2" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded transition" download>Part 2</a>
                <a href="/api/downloads/part3" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded transition" download>Part 3</a>
                <a href="/api/downloads/part4" className="bg-white/20 hover:bg-white/30 text-white text-sm py-2 px-4 rounded transition" download>Part 4</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#1B387A]">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-12 bg-[#1B387A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to perfect your legal citations?</h2>
            <p className="text-lg opacity-90 mb-8">Download the complete NALT Citation Guide and start citing with confidence.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/api/downloads/complete-guide" 
                className="bg-white text-[#1B387A] font-bold py-3 px-8 rounded-lg hover:bg-[#C3CDE1] transition duration-200 shadow-lg"
                download
              >
                Download Complete Guide
              </a>
              <Link href="/citation-generator">
                <span className="bg-transparent text-white font-bold py-3 px-8 rounded-lg border-2 border-white hover:bg-white/10 transition duration-200 cursor-pointer inline-block">
                  Try Citation Generator
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
