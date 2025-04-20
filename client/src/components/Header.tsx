import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown } from 'lucide-react';
import naltCiteLogo from '../assets/nalt-cite-logo-new.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Citation Generator', path: '/citation-generator' },
    { name: 'Glossary', path: '/glossary' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' },
    { name: 'Resources', path: '/resources' },
  ];

  return (
    <header className={`bg-white shadow-sm border-b border-[#1c3877]/10 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md py-2' : 'py-3'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Custom NALT Cite Logo */}
            <Link href="/" className="flex items-center">
              <div className="p-1 hover:opacity-90 transition-opacity">
                <img 
                  src={naltCiteLogo} 
                  alt="NALT Cite Logo" 
                  className={`transition-all duration-300 ${scrolled ? 'h-11 w-auto' : 'h-14 w-auto'}`}
                />
              </div>
            </Link>
            {/* Admin link - not prominent, only for administrator use */}
            <Link href="/admin">
              <span className="ml-2 text-[#1c3877] opacity-50 hover:opacity-80 text-xs cursor-pointer transition-opacity">
                Admin
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`${
                    isActive(item.path)
                      ? 'text-[#1c3877] font-semibold after:content-[""] after:block after:h-0.5 after:bg-[#1c3877] after:mt-0.5'
                      : 'text-[#1c3877] hover:text-[#0f2047] hover:after:content-[""] hover:after:block hover:after:h-0.5 hover:after:bg-[#1c3877]/40 hover:after:mt-0.5'
                  } transition duration-150 font-medium cursor-pointer px-1 py-2 text-sm lg:text-base`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1c3877] hover:text-[#0f2047] focus:outline-none p-2 rounded-md hover:bg-gray-100"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - separate from the header for better styling */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      <div 
        className={`absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="container mx-auto py-3 px-4 sm:px-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2 divide-y divide-gray-100">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`block px-4 py-3 ${
                    isActive(item.path)
                      ? 'text-[#1c3877] font-semibold bg-[#1c3877]/5 rounded-md'
                      : 'text-[#333] hover:text-[#1c3877] hover:bg-[#1c3877]/5 rounded-md'
                  } transition-colors duration-150 cursor-pointer flex justify-between items-center`}
                >
                  {item.name}
                  {isActive(item.path) && <ChevronDown className="h-4 w-4 rotate-180" />}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
