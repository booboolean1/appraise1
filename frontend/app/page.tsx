'use client';

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { StatsSection } from '@/components/stats-section';
import { ProblemsSection } from '@/components/problems-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { BenefitsSection } from '@/components/benefits-section';
import { ResultsSection } from '@/components/results-section';
import { FAQSection } from '@/components/faq-section';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation
        logoText="Appraise"
        navigationLinks={[
          { name: 'How it works', href: '#how-it-works' },
          { name: 'Pricing', href: '/pricing' },
          { name: 'FAQ', href: '#faq' },
        ]}
        ctaButtonText="Get started"
      />
      <HeroSection
        badgeText="Let AI Topple The Low Appraisal"
        headline="Claim back <span class='bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-pulse'>thousands</span><br />from appraisal errors"
        subheadline="Unfair appraisals cost homeowners thousands. Hidden bias skews millions of home values every year."
        primaryButtonText="Check Your Appraisal for Errors"
        secondaryButtonText="How It Helps You Win"
      />
      <StatsSection
        stats={[
          { value: '57%', label: 'Win Rate on Appeals' },
          { value: '6m', label: 'Fast Review Time' },
          { value: '+$10K', label: 'Avg Value Boost' },
          { value: '94%', label: 'Verified Discrepancies' },
        ]}
      />
      <ProblemsSection
        title="Unfair appraisals cost homeowners thousands"
        subtitle="Hidden bias in property valuation affects millions every year."
        features={[
          {
            title: 'Impossible to Read!',
            description: 'Appraisal reports are loaded with jargon most homeowners can’t decode.',
          },
          {
            title: 'Big Money Lost',
            description: 'Low valuations can hike interest, force PMI, or sink selling price or ability to purchase.',
          },
          {
            title: 'Inconsistent Judgments',
            description: 'Identical homes get different values based on biased or careless appraisals.',
          },
        ]}
      />
      <HowItWorksSection
        title="Your 3-Step Fix for a Fair Appraisal"
        subtitle="Fast, powerful, and made for everyday homeowners"
        steps={[
          {
            number: '1',
            title: 'Upload Your Report',
            description: 'Drop in your PDF. We’ll handle the heavy lifting.',
          },
          {
            number: '2',
            title: 'AI Scans for Errors',
            description: 'We detect bias, missed comps, weak adjustments, and more.',
          },
          {
            number: '3',
            title: 'Get Your Results',
            description: 'Get a clear breakdown of every issue worth disputing.',
          },
        ]}
      />
      <BenefitsSection
        title="Take Back What’s Yours"
        features={[
          {
            title: 'Get Top Dollar for Your Home',
            description: "Spot underpricing and biased comps before it's too late.",
          },
          {
            title: 'Unlock Lower Rates',
            description: 'A corrected value could cut your interest by thousands.',
          },
          {
            title: 'Ditch PMI Sooner',
            description: 'A fair value gets you past 20% equity faster.',
          },
          {
            title: 'Win Your Dispute',
            description: 'Use clear AI evidence to back your appeal.',
          },
        ]}
      />
      <ResultsSection
        title="It Works"
        subtitle="Appraise helps real people reclaim real equity"
        caseStudy={{
          title: 'Case Study',
          description: 'What one homeowner got back using Appraise',
          originalValue: '425000',
          adjustedValue: '442000',
          highlight: '+$17,000 equity recovered',
        }}
        metrics={[
          '63% Dispute Success',
          '94% AI Accuracy',
          '87% Homeowner Satisfaction',
        ]}
      />
      <FAQSection
        title="Questions? We’ve Got Answers"
        subtitle="The most common things people ask us"
        faqs={[
          {
            question: 'How does Appraise detect bias in appraisals?',
            answer: 'Our AI system analyzes hundreds of data points including comparable sales, property descriptions, and valuation methodologies. It identifies statistical anomalies, inconsistent reasoning, and potential bias indicators by comparing your appraisal against market data and industry standards.',
          },
          {
            question: 'Is my appraisal report kept confidential?',
            answer: 'Absolutely. We use bank-level encryption to protect your data. Your appraisal report is processed securely and never shared with third parties. We comply with all privacy regulations and you maintain full control over your information.',
          },
          {
            question: 'How long does the analysis take?',
            answer: "Most analyses are completed within 24-48 hours. Complex cases may take up to 72 hours. You'll receive email updates throughout the process and can track progress in your dashboard.",
          },
          {
            question: 'What if the lender rejects my appeal?',
            answer: 'We provide comprehensive documentation and evidence to support your case. If initial appeals are unsuccessful, we offer guidance on next steps including regulatory complaints and alternative dispute resolution options.',
          },
        ]}
      />
      <CTASection
        title="Ready to fight for your home’s real value?"
        subtitle="Get Appraise to claim back thousands in equity for you. Try it now, it's only 12$."
        buttonText="Start My Appraisal Check"
        disclaimer="Secure • Confidential • Results in 6 minutes"
      />
      <Footer
        logoText="Appraise"
        footerLinks={[
          { name: 'Privacy', href: '/privacy' },
          { name: 'Terms', href: '/terms' },
        ]}
        copyrightText="© 2025 Appraise. All rights reserved."
      />
    </div>
  );
}