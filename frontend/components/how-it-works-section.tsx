'use client';

import { Upload, Brain, FileCheck, ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface StepProps {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}

function StepCard({ number, icon: Icon, title, description, index, isVisible }: StepProps) {
  return (
    <div className="relative group">
      {/* Fixed Connection Line - Only show between steps, not extending beyond */}
      {index < 2 && (
        <div className="hidden lg:block absolute top-20 left-full w-16 h-0.5 z-0">
          <div className={`h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000 ${
            isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`} style={{ transitionDelay: `${index * 300 + 600}ms` }} />
          
          {/* Animated Dots */}
          <div className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full transition-all duration-500 ${
            isVisible ? 'left-1/4 opacity-100' : 'left-0 opacity-0'
          }`} style={{ transitionDelay: `${index * 300 + 800}ms` }} />
          <div className={`absolute top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-orange-300 rounded-full transition-all duration-500 ${
            isVisible ? 'left-3/4 opacity-100' : 'left-0 opacity-0'
          }`} style={{ transitionDelay: `${index * 300 + 1000}ms` }} />
        </div>
      )}
      
      <div className={`relative z-10 text-center transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`} style={{ transitionDelay: `${index * 200}ms` }}>
        {/* Enhanced Step Number */}
        <div className="relative mb-6 mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
            <span className="relative z-10">{number}</span>
          </div>
        </div>
        
        {/* Enhanced Floating Icon */}
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto border border-gray-700/50 group-hover:border-orange-500/50 transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="h-8 w-8 text-orange-400 group-hover:animate-pulse relative z-10" />
          </div>
          
          {/* Enhanced Orbiting Elements */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute top-0 left-0 w-3 h-3 text-purple-400 animate-spin opacity-70" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Enhanced Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300 flex items-center justify-center gap-2">
            {title}
            {index === 2 && <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />}
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-sm mx-auto group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
        </div>
        
        {/* Enhanced Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        
        {/* Progress Indicator */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ${
            isVisible ? 'w-full' : 'w-0'
          }`} style={{ transitionDelay: `${index * 200 + 500}ms` }} />
        </div>
      </div>
    </div>
  );
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export function HowItWorksSection({ title, subtitle, steps }: HowItWorksSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const icons = [Upload, Brain, FileCheck];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-500/50 to-transparent animate-pulse" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto flex items-center justify-center gap-2">
              {subtitle}
              <Sparkles className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '3s' }} />
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              icon={icons[index]}
              title={step.title}
              description={step.description}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
        
        {/* Enhanced Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-700 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center text-orange-400 font-semibold group cursor-pointer hover:text-orange-300 transition-colors duration-300">
            <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            <span className="mr-2">Start your analysis</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}