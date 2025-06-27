'use client';

import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterProps {
  logoText: string;
  footerLinks: FooterLink[];
  copyrightText: string;
}

export function Footer({ logoText, footerLinks, copyrightText }: FooterProps) {

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
              {logoText}
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex space-x-8 mb-8 md:mb-0">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}