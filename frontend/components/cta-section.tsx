'use client';

import { ArrowRight, Shield, Clock, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  disclaimer: string;
}

export function CTASection({
  title,
  subtitle,
  buttonText,
  disclaimer,
}: CTASectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (ref.current) {
      ref.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [ref]);

  const features = disclaimer.split('•').map((text, index) => {
    const trimmedText = text.trim();
    if (index === 0) return { icon: Shield, text: trimmedText, color: 'green' };
    if (index === 1) return { icon: CheckCircle, text: trimmedText, color: 'blue' };
    return { icon: Clock, text: trimmedText, color: 'orange' };
  });

  return (
    <section 
      ref={ref}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent" />
        <div 
          className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity: isVisible ? 0.6 : 0,
          }}
        />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Floating Elements */}
        <div className="absolute -top-8 left-1/4 w-4 h-4 bg-orange-400 rounded-full animate-bounce opacity-60" />
        <div className="absolute -top-4 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-40" />
        <div className="absolute top-0 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-50" />

        <div className={`transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Icon Header */}
          <div className="flex justify-center mb-8">
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
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Enhanced CTA Button */}
        <div className={`transform transition-all duration-700 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative inline-block mb-12">
            <Link href="/login">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white px-12 py-6 text-xl font-semibold group shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 transform hover:scale-105 bg-[length:200%_100%] hover:bg-[position:100%_0] animate-gradient"
              >
                <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                {buttonText}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </Button>
            </Link>
            
            {/* Orbiting Elements */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-bounce" />
          </div>
        </div>

        {/* Enhanced Feature Pills */}
        <div className={`transform transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.text}
                className={`group flex items-center px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700/50 hover:border-${feature.color}-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-${feature.color}-500/20`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 bg-${feature.color}-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-${feature.color}-500/30 transition-colors duration-300`}>
                  <feature.icon className={`h-4 w-4 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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