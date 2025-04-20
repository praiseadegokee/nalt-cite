import { Link } from 'wouter';
import { Download, Plus } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';
import mockupCoverImg from '@/assets/mockup-cover.png';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1B387A] to-[#294D98] text-white py-20 md:py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto">
            {/* Text Content */}
            <div className="md:w-7/12 lg:w-1/2 text-center md:text-left">
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-white/90 font-medium">Official Citation Guide</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">Nigerian Association of Law Teachers Uniform Format and Citation Guide</h1>
              <p className="text-lg opacity-90 mb-8">The comprehensive resource for legal research and writing standards in Nigeria. Ensure your citations are accurate and consistent.</p>
              
              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 md:gap-6">
                <a 
                  href="/api/downloads/complete-guide" 
                  className="bg-white text-[#1B387A] font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-[#C3CDE1] transition duration-200 shadow-lg flex items-center justify-center"
                  download
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Complete Guide
                </a>
                <Link href="/citation-generator">
                  <span className="bg-[#294D98] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-white hover:bg-[#1B387A] transition duration-200 shadow-lg flex items-center justify-center cursor-pointer">
                    <Plus className="h-5 w-5 mr-2" />
                    Generate Citation
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Book Mockup Image */}
            <div className="md:w-5/12 lg:w-1/2 mt-8 md:mt-0 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl"></div>
                <img 
                  src={mockupCoverImg} 
                  alt="NALT Citation Guide Book Cover" 
                  className="w-64 md:w-80 lg:w-96 relative z-10 drop-shadow-2xl transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#1B387A]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#1B387A] font-medium">What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1B387A]">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore the tools and resources that make NALT Citation Guide the premier solution for Nigerian legal citation standards</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
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
    </>
  );
}
