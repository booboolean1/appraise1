'use client';

import { FileText, TrendingDown, Scale } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface ProblemsSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export function ProblemsSection({ title, subtitle, features }: ProblemsSectionProps) {
  const icons = [FileText, TrendingDown, Scale];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <Icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}