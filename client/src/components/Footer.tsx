import { Link } from 'wouter';
import { Mail, Phone, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const FooterSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border-b border-gray-700 md:border-none pb-2 md:pb-0">
        <div
          className="flex justify-between items-center py-3 md:py-0 md:mb-4 cursor-pointer md:cursor-default"
          onClick={() => toggleSection(id)}
        >
          <h3 className="text-white font-semibold text-base md:text-lg">{title}</h3>
          <ChevronRight className={`h-5 w-5 text-gray-400 md:hidden transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 md:block ${isExpanded ? 'max-h-96' : 'max-h-0 md:max-h-none'}`}>
          {children}
        </div>
      </div>
    );
  };
  
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Column 1: About */}
          <FooterSection title="About NALT Cite" id="about">
            <p className="text-sm mb-4 text-gray-400">The official resource for the Nigerian Association of Law Teachers Uniform Format and Citation Guide, providing standards for legal writing and citation in Nigeria.</p>
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </FooterSection>
          
          {/* Column 2: Quick Links */}
          <FooterSection title="Quick Links" id="quick-links">
            <nav className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2">
              <Link href="/">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Home
                </span>
              </Link>
              <Link href="/citation-generator">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Citation Generator
                </span>
              </Link>
              <Link href="/glossary">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Glossary
                </span>
              </Link>
              <Link href="/faq">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  FAQ
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Blog
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Resources
                </span>
              </Link>
            </nav>
          </FooterSection>
          
          {/* Column 3: Resources */}
          <FooterSection title="Resources" id="resources">
            <nav className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2">
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Complete Guide
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Citation Templates
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Writing Style Guide
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Research Methodology
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors duration-200 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 opacity-70" />
                  Video Tutorials
                </span>
              </Link>
            </nav>
          </FooterSection>
          
          {/* Column 4: Contact */}
          <FooterSection title="Contact Us" id="contact">
            <address className="not-italic text-sm text-gray-400">
              <p className="mb-2">Nigerian Association of Law Teachers</p>
              <p className="mb-2">Faculty of Law</p>
              <p className="mb-2">University of Nigeria, Nsukka</p>
              <p className="mb-4">Enugu State, Nigeria</p>
              <a href="mailto:contact@naltcite.org" className="mb-2 flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Mail className="h-4 w-4 mr-2" />
                contact@naltcite.org
              </a>
              <a href="tel:+2348012345678" className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Phone className="h-4 w-4 mr-2" />
                +234 (0) 8012345678
              </a>
            </address>
          </FooterSection>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-xs sm:text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nigerian Association of Law Teachers. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white cursor-pointer transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white cursor-pointer transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
