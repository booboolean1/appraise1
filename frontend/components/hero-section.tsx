'use client';

import { ArrowRight, PlayCircle, Sparkles, Zap, Star, Code, Brain } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  badgeText: string;
  headline: string;
  subheadline: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onSecondaryClick?: () => void;
}

export function HeroSection({
  badgeText,
  headline,
  subheadline,
  primaryButtonText,
  secondaryButtonText,
  onSecondaryClick,
}: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    setIsLoaded(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        {/* Dynamic Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-pulse" />
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}

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

        {/* Animated Beams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/30 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center">
          {/* Animated Badge with Icons */}
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="mb-8 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-800/80 backdrop-blur-sm text-gray-200 border-gray-700/50 hover:bg-gray-700/80 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 animate-shimmer" />
              <Sparkles className="w-3 h-3 mr-2 text-orange-400 group-hover:animate-spin" />
              {badgeText}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Enhanced Headline with Typewriter Effect */}
          <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span dangerouslySetInnerHTML={{ __html: headline }} />
            </h1>
          </div>

          {/* Enhanced Subheadline */}
          <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className={`transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/login">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold group shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                  <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">{primaryButtonText}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>
              </Link>
              <Button
                onClick={onSecondaryClick}
                variant="outline"
                size="lg"
                className="relative border-gray-600/50 bg-gray-900/50 backdrop-blur-sm text-gray-300 hover:bg-gray-800/80 hover:text-white hover:border-orange-500/50 px-8 py-4 text-lg font-semibold group transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
                <span className="relative z-10">{secondaryButtonText}</span>
              </Button>
            </div>
          </div>

          {/* Revolutionary Hero Visual */}
          <div className={`relative transform transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="relative bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-orange-500/10 rounded-3xl p-8 backdrop-blur-sm border border-orange-500/20 shadow-2xl overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
              </div>

              {/* Floating Tech Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 rounded-full animate-bounce opacity-60" />
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-blue-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }} />
              <div className="absolute -bottom-3 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s' }} />
              <Code className="absolute top-4 right-4 w-5 h-5 text-purple-400 animate-pulse" />
              
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800/50 relative overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  <span className="text-sm text-gray-400 font-mono flex items-center">
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    AI Appraisal Analysis
                  </span>
                </div>
                
                {/* Enhanced Progress Bars */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse" />
                        Bias Detection
                      </span>
                      <span className="font-mono">94%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 animate-pulse" />
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full relative overflow-hidden"
                        style={{ width: '94%', animation: 'slideIn 2s ease-out' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        Market Analysis
                      </span>
                      <span className="font-mono">87%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse" />
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full relative overflow-hidden"
                        style={{ width: '87%', animation: 'slideIn 2.5s ease-out' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '1s' }} />
                        Valuation Accuracy
                      </span>
                      <span className="font-mono">96%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 animate-pulse" />
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full relative overflow-hidden"
                        style={{ width: '96%', animation: 'slideIn 3s ease-out' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Result Card */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-shimmer" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-300 mb-1 flex items-center">
                        <Zap className="w-3 h-3 mr-1 animate-pulse" />
                        Potential Recovery
                      </div>
                      <div className="text-2xl font-bold text-green-400 animate-pulse font-mono">
                        +$17,000
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center relative">
                        <ArrowRight className="w-6 h-6 text-green-400 animate-bounce" />
                        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { width: 0%; }
          to { width: var(--final-width); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}