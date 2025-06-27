'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { Button } from './ui/button';

interface NavLink {
  name: string;
  href: string;
}

interface NavigationProps {
  logoText: string;
  navigationLinks: NavLink[];
  ctaButtonText: string;
  onCtaClick?: () => void;
}

export function Navigation({
  logoText,
  navigationLinks,
  ctaButtonText,
  onCtaClick,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-gray-900/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-600 transition-all duration-300">
                {logoText}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium transition-all duration-300 group"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {link.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/login">
              <Button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {ctaButtonText}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-gray-300 hover:text-white p-2 transition-colors duration-300"
            >
              <div className="w-6 h-6 relative">
                <Menu className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl mt-2 border border-gray-800/50">
            {navigationLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium transition-all duration-300 rounded-lg hover:bg-gray-800/50"
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Link href="/login" className="w-full">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {ctaButtonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}