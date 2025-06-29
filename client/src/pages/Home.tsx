import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import { useSEO } from '@/hooks/use-seo';

export default function Home() {
  useSEO({
    title: "NALT Cite - Nigerian Legal Citation Generator & Assistant",
    description: "Professional legal citation generator for Nigerian law. Create accurate NALT format citations for cases, statutes, books, and journal articles. AI-powered legal writing assistant for law students and practitioners.",
    keywords: "NALT citation, Nigerian law citation, legal citation generator, NALT format, Nigerian legal writing, law citation tool, legal research Nigeria, NALT guide, citation assistant, legal bibliography",
    canonicalUrl: "https://naltcite.replit.app/"
  });

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
