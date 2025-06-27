'use client';

import { useState, useEffect } from 'react';
import { Home, Scale, FileText, Shield, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: `By accessing and using Appraise's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: Shield,
      content: `Appraise provides AI-powered appraisal analysis services designed to identify potential bias and errors in real estate appraisals. Our service includes document analysis, bias detection, and generation of dispute documentation. Results are provided for informational purposes and do not constitute professional appraisal services.`
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: Scale,
      content: `Users are responsible for providing accurate information and documents. You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services. You are responsible for maintaining the confidentiality of your account credentials.`
    },
    {
      id: 'limitations',
      title: 'Limitations of Liability',
      icon: AlertTriangle,
      content: `Appraise's analysis is provided "as is" without warranties of any kind. We do not guarantee specific outcomes from using our dispute documentation. Our liability is limited to the amount paid for our services. We are not responsible for decisions made by lenders, appraisers, or other third parties.`
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: Shield,
      content: `We are committed to protecting your privacy and handling your data responsibly. All uploaded documents are processed securely and deleted after analysis completion. We do not share your personal information with third parties except as required by law.`
    },
    {
      id: 'modifications',
      title: 'Modifications to Terms',
      icon: Clock,
      content: `Appraise reserves the right to modify these terms at any time. Users will be notified of significant changes via email or through our platform. Continued use of our services after modifications constitutes acceptance of the updated terms.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        </div>

        {/* Dynamic Orbs */}
        <div 
          className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transition-all duration-300 ease-out animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-600 transition-all duration-300">
                Appraise
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. Last updated: January 2025.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-xl hover:border-orange-500/30 transition-all duration-500 transform hover:scale-[1.02] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {/* Section Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-300">
                      <section.icon className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className={`mt-16 text-center transform transition-all duration-700 delay-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms & Conditions, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600/50 hover:border-orange-500/50 font-semibold rounded-xl transition-all duration-300"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}