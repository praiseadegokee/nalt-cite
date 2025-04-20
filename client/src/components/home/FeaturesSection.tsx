import FeatureCard from '@/components/FeatureCard';
import { features } from '@/lib/data';

export default function FeaturesSection() {
  return (
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
  );
}