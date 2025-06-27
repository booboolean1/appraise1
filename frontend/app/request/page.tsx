'use client';

import { useState, useEffect } from 'react';
import { 
  Home, ShieldCheck, CheckCircle, Mail, User, Phone, MapPin, 
  Building, FileText, Copy, Check, ArrowRight, Sparkles, 
  AlertTriangle, Clock, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  loanOfficerName: string;
  lenderCompany: string;
  lenderAddress: string;
  loanApplicationNumber: string;
}

export default function RequestPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [userChoice, setUserChoice] = useState<'yes' | 'no' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    loanOfficerName: '',
    lenderCompany: '',
    lenderAddress: '',
    loanApplicationNumber: ''
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateEmailTemplate = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${formData.fullName}
${formData.propertyAddress ? formData.propertyAddress.split(',')[0] : '[Your Address]'}
${formData.email}
${formData.phone}

${today}

${formData.lenderCompany || '[Lender\'s Name]'}
${formData.loanOfficerName ? formData.loanOfficerName : '[Loan Officer\'s Name, if known]'}
${formData.lenderAddress || '[Company Address]'}

Subject: Formal Request for Copy of Real Estate Appraisal Report

Dear ${formData.lenderCompany || '[Lender\'s Name]'},

I am writing to formally request a complete copy of the appraisal report conducted in connection with my mortgage application for the property located at:

${formData.propertyAddress || '[Property Address]'}

As a loan applicant, I understand that under the Equal Credit Opportunity Act (ECOA), Regulation B, I am entitled to receive a copy of any and all valuations—including the appraisal report—developed as part of my application process. I am exercising that right through this written request.

Please provide the report(s) at your earliest convenience, and no later than 30 days from the date of this request, as required by federal regulation.

You may deliver the report via email to ${formData.email || '[Your Email]'}, or by mail to the address listed above. If there are any forms or further steps I need to complete to facilitate this request, kindly let me know promptly.

Thank you for your assistance and timely attention to this matter.

Sincerely,
${formData.fullName || '[Your Full Name]'}
${formData.loanApplicationNumber ? `Loan Application #: ${formData.loanApplicationNumber}` : 'Loan Application #: [if available]'}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmailTemplate());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isFormComplete = formData.fullName && formData.email && formData.phone && 
                       formData.propertyAddress && formData.lenderCompany && formData.lenderAddress;

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Request Your Appraisal Report
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get the appraisal report you're legally entitled to receive from your lender.
            </p>
          </div>

          {/* Section 1: Legal Explanation */}
          <div className={`mb-12 transform transition-all duration-700 delay-200 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="relative bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 rounded-3xl animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-shimmer" />
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-40" />
              
              <div className="relative z-10 flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-8 w-8 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    Your Legal Right to the Appraisal Report
                    <Sparkles className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                  </h2>
                  <p className="text-gray-200 leading-relaxed text-lg">
                    Under the Equal Credit Opportunity Act (ECOA), Regulation B (12 CFR § 1002.14), lenders are legally required to provide a copy of the appraisal report and other written valuations developed in connection with a mortgage application. This must be delivered promptly—no later than three business days before loan consummation, or within 30 days of receiving a request if the loan is not consummated or denied.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: User Prompt */}
          {!userChoice && (
            <div className={`mb-12 transform transition-all duration-700 delay-400 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Have you already requested the appraisal report from your lender?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Button
                  onClick={() => setUserChoice('yes')}
                  className="group relative h-24 bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 hover:border-green-400/50 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 group-hover:animate-bounce" />
                    Yes, I already did
                  </span>
                </Button>
                
                <Button
                  onClick={() => setUserChoice('no')}
                  className="group relative h-24 bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30 hover:border-orange-400/50 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Mail className="w-6 h-6 text-orange-400 group-hover:animate-bounce" />
                    No, not yet
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Yes Response */}
          {userChoice === 'yes' && (
            <div className="mb-12 transform transition-all duration-700 animate-fade-in-up">
              <div className="relative bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30 shadow-2xl overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 rounded-3xl animate-pulse" />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-400 animate-pulse" />
                      </div>
                      <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Great job!</h2>
                  <p className="text-xl text-gray-200 leading-relaxed">
                    Come back here once you receive your report, and we'll walk you through the next steps.
                  </p>
                  
                  <div className="mt-8">
                    <Button
                      onClick={() => setUserChoice(null)}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      ← Go Back
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Response - Form */}
          {userChoice === 'no' && (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form Section */}
              <div className="transform transition-all duration-700 animate-fade-in-up">
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 rounded-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Request Information</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-400" />
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="John Smith"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-orange-400" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-400" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(555) 123-4567"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Property Address */}
                      <div className="space-y-2">
                        <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          Property Address *
                        </Label>
                        <Input
                          id="propertyAddress"
                          value={formData.propertyAddress}
                          onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                          placeholder="123 Main St, City, State 12345"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Loan Officer Name */}
                      <div className="space-y-2">
                        <Label htmlFor="loanOfficerName" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          Loan Officer's Name (optional)
                        </Label>
                        <Input
                          id="loanOfficerName"
                          value={formData.loanOfficerName}
                          onChange={(e) => handleInputChange('loanOfficerName', e.target.value)}
                          placeholder="Jane Doe"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Lender Company */}
                      <div className="space-y-2">
                        <Label htmlFor="lenderCompany" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-400" />
                          Lender's Company Name *
                        </Label>
                        <Input
                          id="lenderCompany"
                          value={formData.lenderCompany}
                          onChange={(e) => handleInputChange('lenderCompany', e.target.value)}
                          placeholder="ABC Mortgage Company"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Lender Address */}
                      <div className="space-y-2">
                        <Label htmlFor="lenderAddress" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          Lender's Address *
                        </Label>
                        <Input
                          id="lenderAddress"
                          value={formData.lenderAddress}
                          onChange={(e) => handleInputChange('lenderAddress', e.target.value)}
                          placeholder="456 Business Ave, City, State 12345"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>

                      {/* Loan Application Number */}
                      <div className="space-y-2">
                        <Label htmlFor="loanApplicationNumber" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          Loan Application Number (optional)
                        </Label>
                        <Input
                          id="loanApplicationNumber"
                          value={formData.loanApplicationNumber}
                          onChange={(e) => handleInputChange('loanApplicationNumber', e.target.value)}
                          placeholder="LA123456789"
                          className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        onClick={() => setUserChoice(null)}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 rounded-xl transition-all duration-300"
                      >
                        ← Go Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="transform transition-all duration-700 animate-fade-in-up delay-200">
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 rounded-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Email Preview</h2>
                      </div>
                      
                      {isFormComplete && (
                        <Button
                          onClick={copyToClipboard}
                          className={`transition-all duration-300 transform hover:scale-105 ${
                            copied 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          } text-white px-6 py-3 rounded-xl shadow-lg`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5 mr-2" />
                              Copy to Clipboard
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {generateEmailTemplate()}
                      </pre>
                    </div>
                    
                    {!isFormComplete && (
                      <div className="mt-4 flex items-center space-x-2 text-orange-400">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm">Complete the required fields to generate your email</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}