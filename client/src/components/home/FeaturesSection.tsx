import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';

export default function FeaturesSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl"></div>
      </div>
      
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(#1B387A 1px, transparent 1px)", 
          backgroundSize: "30px 30px" 
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block bg-[#1B387A]/10 px-5 py-2 rounded-full mb-4 shadow-sm">
            <span className="text-[#1B387A] font-medium tracking-wide">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1B387A] via-[#2c4da3] to-[#3a61cc]">
            Key Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore the tools and resources that make NALT Citation Guide the premier solution for Nigerian legal citation standards
          </p>
        </div>
        
        {/* Subtle divider */}
        <div className="relative max-w-3xl mx-auto mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1B387A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div key={index} 
              className="transform transition duration-500 hover:-translate-y-2" 
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <FeatureCard
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
                link={feature.link} 
                linkText={feature.linkText} 
                borderColor={index % 3 === 0 ? 'border-[#1B387A]' : (index % 3 === 1 ? 'border-[#294D98]' : 'border-[#3a61cc]')}
                iconBgColor={index % 3 === 0 ? 'bg-[#1B387A]/10' : (index % 3 === 1 ? 'bg-[#294D98]/10' : 'bg-[#3a61cc]/10')}
                iconColor={index % 3 === 0 ? 'text-[#1B387A]' : (index % 3 === 1 ? 'text-[#294D98]' : 'text-[#3a61cc]')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}