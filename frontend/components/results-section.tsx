'use client';

import { ArrowUp, Award, Users, Star, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface CaseStudy {
  title: string;
  description: string;
  originalValue: string;
  adjustedValue: string;
  highlight: string;
}

interface ResultsSectionProps {
  title: string;
  subtitle: string;
  caseStudy: CaseStudy;
  metrics: string[];
}

export function ResultsSection({
  title,
  subtitle,
  caseStudy,
  metrics,
}: ResultsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    original: parseInt(caseStudy.originalValue),
    adjusted: parseInt(caseStudy.originalValue),
    difference: 0,
  });
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
    if (isVisible) {
      // Animate the values
      let progress = 0;
      const duration = 2000;
      const startTime = Date.now();
      const original = parseInt(caseStudy.originalValue);
      const adjusted = parseInt(caseStudy.adjustedValue);
      const difference = adjusted - original;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        const currentAdjusted = original + difference * easeOutCubic;
        const currentDifference = currentAdjusted - original;

        setAnimatedValues({
          original: original,
          adjusted: Math.round(currentAdjusted),
          difference: Math.round(currentDifference),
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      setTimeout(() => animate(), 500);
    }
  }, [isVisible, caseStudy]);

  const metricIcons = [
    { icon: Award, color: 'orange' },
    { icon: Star, color: 'blue' },
    { icon: Users, color: 'green' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
      </div>
      
      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Interactive Case Study */}
          <div className={`space-y-8 transform transition-all duration-700 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-orange-400" />
                <h3 className="text-2xl font-semibold text-white">
                  {caseStudy.title}
                </h3>
              </div>
              <p className="text-gray-300 text-lg">
                {caseStudy.description}
              </p>
            </div>
            
            {/* Interactive Value Display */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-ping" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-bounce" />
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-3 font-medium">Original Value</div>
                  <div className="text-3xl font-bold text-white font-mono">
                    ${animatedValues.original.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-3 font-medium">Adjusted Value</div>
                  <div className="text-3xl font-bold text-white font-mono">
                    ${animatedValues.adjusted.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Value Recovery Progress</span>
                  <span>
                    {Math.round(
                      (animatedValues.difference /
                        (parseInt(caseStudy.adjustedValue) -
                          parseInt(caseStudy.originalValue))) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        (animatedValues.difference /
                          (parseInt(caseStudy.adjustedValue) -
                            parseInt(caseStudy.originalValue))) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              
              {/* Result Highlight */}
              <div className="relative p-6 bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-500/20 rounded-2xl border border-green-500/30 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-green-300 text-sm font-medium mb-1">Equity Recovered</div>
                    <div className="text-3xl font-bold text-green-400 font-mono">
                      +${animatedValues.difference.toLocaleString()}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                      <ArrowUp className="w-8 h-8 text-green-400 animate-bounce" />
                    </div>
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Metrics */}
          <div className={`space-y-6 transform transition-all duration-700 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            {metrics.map((metric, index) => {
              const Icon = metricIcons[index].icon;
              const color = metricIcons[index].color;
              return (
                <div
                  key={metric}
                  className={`group relative p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-${color}-500/50 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-${color}-500/10`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Background Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center group-hover:bg-${color}-500/30 transition-colors duration-300`}
                      >
                        <Icon
                          className={`h-6 w-6 text-${color}-400 group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      <div>
                        <div className="text-gray-300 text-sm font-medium mb-1">
                          {metric}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <TrendingUp
                        className={`h-6 w-6 text-${color}-400 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                      />
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${color}-500/20 via-transparent to-${color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{ padding: '1px' }}
                  >
                    <div className="w-full h-full bg-gray-900/90 rounded-2xl" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}