'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Clock, DollarSign, Target, Sparkles, Zap } from 'lucide-react';

interface StatProps {
  value: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
  color: string;
}

function StatCard({ value, label, icon: Icon, delay = 0, color }: StatProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState('0');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      // Enhanced number animation
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue) {
        let current = 0;
        const target = parseInt(numericValue);
        const increment = target / 50; // Smoother animation
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setAnimatedValue(value);
            clearInterval(timer);
          } else {
            setAnimatedValue(value.replace(numericValue, Math.floor(current).toString()));
          }
        }, 30);
        return () => clearInterval(timer);
      } else {
        setAnimatedValue(value);
      }
    }
  }, [isVisible, value]);

  return (
    <div 
      ref={ref}
      className={`group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm hover:border-${color}-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-${color}-500/10 overflow-hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Enhanced Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 via-transparent to-${color}-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer opacity-0 group-hover:opacity-100" />
      
      {/* Floating Icon with Enhanced Effects */}
      <div className={`absolute -top-3 -right-3 w-8 h-8 bg-${color}-500/20 rounded-full flex items-center justify-center group-hover:bg-${color}-500/30 transition-all duration-300 group-hover:animate-bounce relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-${color}-400/20 rounded-full animate-ping`} />
        <Icon className={`h-4 w-4 text-${color}-400 relative z-10`} />
      </div>
      
      {/* Sparkle Effects */}
      <Sparkles className={`absolute top-2 left-2 w-3 h-3 text-${color}-400/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <Zap className={`absolute bottom-2 right-2 w-3 h-3 text-${color}-400/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ animationDelay: '0.5s' }} />
      
      <div className="relative z-10 text-center">
        <div className={`text-4xl sm:text-5xl font-bold text-${color}-400 mb-2 font-mono relative`}>
          <span className="relative z-10">{animatedValue}</span>
          <div className={`absolute inset-0 text-${color}-400/20 blur-sm`}>{animatedValue}</div>
        </div>
        <div className="text-gray-300 text-sm sm:text-base font-medium group-hover:text-white transition-colors duration-300">
          {label}
        </div>
      </div>
      
      {/* Enhanced Pulse Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-${color}-500/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-1000 ${
          isVisible ? 'w-full' : 'w-0'
        }`} style={{ transitionDelay: `${delay + 500}ms` }} />
      </div>
    </div>
  );
}

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const statIcons = [
    { icon: TrendingUp, color: 'orange' },
    { icon: Clock, color: 'blue' },
    { icon: DollarSign, color: 'green' },
    { icon: Target, color: 'purple' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]" />
        </div>
        
        {/* Animated Particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-lg animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Proven Track Record
          </h2>
          <p className="text-gray-400">Real results from real homeowners</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={statIcons[index].icon}
              color={statIcons[index].color}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}