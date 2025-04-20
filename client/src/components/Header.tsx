import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import naltCiteLogo from '../assets/nalt-cite-logo-new.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

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
    <header className="bg-white shadow-sm border-b border-[#1c3877]/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            {/* Custom NALT Cite Logo */}
            <Link href="/" className="flex items-center">
              <div className="p-1 hover:opacity-90 transition-opacity">
                <img 
                  src={naltCiteLogo} 
                  alt="NALT Cite Logo" 
                  className="h-14 w-auto"
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
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`${
                    isActive(item.path)
                      ? 'text-[#1c3877] font-semibold'
                      : 'text-[#1c3877] hover:text-[#0f2047]'
                  } transition duration-150 font-medium cursor-pointer`}
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
              className="text-[#1c3877] hover:text-[#0f2047] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="absolute top-14 right-0 left-0 bg-[#1c3877] z-50 shadow-lg">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <span 
                        className={`block px-3 py-2 ${
                          isActive(item.path)
                            ? 'bg-[#0f2047] text-white'
                            : 'text-white hover:bg-[#0f2047]'
                        } rounded cursor-pointer`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
