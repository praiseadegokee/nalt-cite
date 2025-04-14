import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

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
    <header className="bg-[#1B387A] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo placeholder */}
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-[#1B387A] font-bold text-lg">NC</span>
            </div>
            <Link href="/">
              <span className="text-white font-bold text-xl sm:text-2xl cursor-pointer">NALT Cite</span>
            </Link>
            {/* Admin link - not prominent, only for administrator use */}
            <Link href="/admin">
              <span className="ml-2 text-white opacity-30 hover:opacity-80 text-xs cursor-pointer transition-opacity">
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
                      ? 'text-[#C3CDE1]'
                      : 'text-white hover:text-[#C3CDE1]'
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
              className="text-white hover:text-[#C3CDE1] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="absolute top-16 right-0 left-0 bg-[#1B387A] z-50 shadow-lg">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <span 
                        className={`block px-3 py-2 ${
                          isActive(item.path)
                            ? 'bg-[#294D98] text-white'
                            : 'text-white hover:bg-[#294D98]'
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
