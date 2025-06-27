'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Zap, Users, Building, ArrowRight, Sparkles, Crown, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  color: string;
  popular?: boolean;
  cta: string;
  ctaVariant: 'default' | 'outline' | 'secondary';
}

export default function PricingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      id: 'buyer',
      name: 'Buyer',
      price: '$8',
      period: 'per report',
      description: 'Perfect for individual homeowners who need a single appraisal analysis.',
      features: [
        'Complete AI analysis with bias detection',
        'Professional dispute letter generation',
        '3-6 minute turnaround time'
      ],
      icon: Users,
      color: 'blue',
      cta: 'Get Single Report',
      ctaVariant: 'outline'
    },
    {
      id: 'realtor',
      name: 'Realtor',
      price: '$25',
      period: 'per month',
      description: 'Ideal for real estate professionals handling multiple clients.',
      features: [
        'Up to 5 reports per month',
        'Priority 3-6 minute processing',
        'White-label report options'
      ],
      icon: Building,
      color: 'orange',
      popular: true,
      cta: 'Get Started',
      ctaVariant: 'default'
    },
    {
      id: 'lender',
      name: 'Lender',
      price: 'Custom',
      period: 'enterprise',
      description: 'Tailored solutions for lending institutions and large-scale operations.',
      features: [
        'Unlimited reports with 3-6 minute processing',
        'Custom integration and API access',
        'Dedicated account manager'
      ],
      icon: Crown,
      color: 'purple',
      cta: 'Get In Touch',
      ctaVariant: 'secondary'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-orange-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-600 transition-all duration-300">
                Appraise
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                Sign In
              </Link>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transparent pricing for every need. Start recovering your equity today with our AI-powered appraisal analysis.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`relative group transform transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                } ${tier.popular ? 'lg:scale-105' : ''}`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 text-sm font-semibold shadow-lg animate-pulse">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Card Container */}
                <div className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 overflow-hidden ${
                  tier.popular 
                    ? 'border-orange-500/50 shadow-2xl shadow-orange-500/10' 
                    : 'border-gray-700/50 hover:border-gray-600/50'
                } ${hoveredTier === tier.id ? 'scale-105 shadow-2xl' : ''}`}>
                  
                  {/* Background Effects */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${tier.color}-500/5 via-transparent to-${tier.color}-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
                  
                  {/* Floating Elements */}
                  <div className={`absolute -top-2 -right-2 w-4 h-4 bg-${tier.color}-400 rounded-full animate-ping opacity-60`} />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-40" />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className={`w-16 h-16 bg-${tier.color}-500/20 rounded-2xl flex items-center justify-center group-hover:bg-${tier.color}-500/30 transition-colors duration-300`}>
                            <tier.icon className={`h-8 w-8 text-${tier.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                          </div>
                          <div className={`absolute inset-0 bg-${tier.color}-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                      <div className="mb-4">
                        <span className={`text-4xl font-bold text-${tier.color}-400`}>{tier.price}</span>
                        <span className="text-gray-400 ml-2">/{tier.period}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-start space-x-3 group/feature"
                          style={{ transitionDelay: `${featureIndex * 50}ms` }}
                        >
                          <div className={`w-5 h-5 bg-${tier.color}-500/20 rounded-full flex items-center justify-center mt-0.5 group-hover/feature:bg-${tier.color}-500/30 transition-colors duration-300`}>
                            <Check className={`w-3 h-3 text-${tier.color}-400`} />
                          </div>
                          <span className="text-gray-300 text-sm group-hover/feature:text-white transition-colors duration-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full py-3 text-lg font-semibold transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden ${
                        tier.ctaVariant === 'default'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25'
                          : tier.ctaVariant === 'outline'
                          ? `border-${tier.color}-500/50 bg-${tier.color}-500/10 text-${tier.color}-400 hover:bg-${tier.color}-500/20 hover:border-${tier.color}-400`
                          : `bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-600/50 hover:border-${tier.color}-500/50`
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {tier.id === 'lender' ? (
                          <>
                            <Phone className="w-5 h-5" />
                            {tier.cta}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                            {tier.cta}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className={`text-center mt-20 transform transition-all duration-700 delay-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Bank-level Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm">USPAP Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">94% Success Rate</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              All plans include secure document processing, professional compliance review, and our satisfaction guarantee. 
              Cancel anytime with no hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}