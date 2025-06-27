'use client';

import { TrendingUp, Percent, Shield, FileText } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  title: string;
  features: Feature[];
}

export function BenefitsSection({ title, features }: BenefitsSectionProps) {
  const icons = [TrendingUp, Percent, Shield, FileText];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <Icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
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