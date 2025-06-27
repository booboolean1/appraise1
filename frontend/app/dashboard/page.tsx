'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, Upload, FileText, Brain, CheckCircle, Clock,
  AlertTriangle, TrendingUp, Zap, Sparkles, ArrowRight,
  User, Scale, FileCheck, BarChart3, Shield, Eye,
  Play, Pause, Download, Copy, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, DocumentData } from 'firebase/firestore';
import { FileUpload } from '@/components/file-upload';

interface Report {
  id: string;
  name: string;
  status: string;
}

interface AgentCard {
  id: string;
  persona: string;
  title: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  icon: React.ElementType;
  output: string[];
  color: string;
}

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeAgents, setActiveAgents] = useState<AgentCard[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'reports'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userReports: Report[] = [];
        querySnapshot.forEach((doc) => {
          userReports.push({ id: doc.id, ...doc.data() } as Report);
        });
        setReports(userReports);
        if (userReports.length > 0 && !selectedReport) {
          setSelectedReport(userReports[0]);
        }
      });
      return () => unsubscribe();
    }
  }, [user, selectedReport]);

  useEffect(() => {
    if (selectedReport) {
      const unsubscribe = onSnapshot(doc(db, 'reports', selectedReport.id), (doc) => {
        const data = doc.data();
        if (data) {
          const agentData: AgentCard[] = [
            {
              id: '1',
              persona: 'Data Specialist',
              title: '1. Document Processing & Data Extraction',
              status: data.property_info?.error ? 'error' : data.property_info ? 'complete' : 'pending',
              icon: FileText,
              color: 'blue',
              output: data.property_info ? [
                '✅ PDF parsed successfully.',
                `✅ Extracted property info: ${data.property_info.PropertyAddress}`,
                `✅ Extracted ${data.structured_data?.comparables?.length || 0} comparables.`
              ] : []
            },
            {
              id: '2',
              persona: 'Rules Engine',
              title: '2. Identifying Red Flags',
              status: data.red_flags?.error ? 'error' : data.red_flags ? 'complete' : 'pending',
              icon: AlertTriangle,
              color: 'orange',
              output: data.red_flags ? data.red_flags.map((flag: any) => `${flag.status === 'Flagged' ? '[!]' : '[✓]'} ${flag.details}`) : []
            },
            {
              id: '3',
              persona: 'Senior Appraisal Reviewer',
              title: '3. Qualitative Narrative Analysis',
              status: data.qualitative_analysis_findings?.error ? 'error' : data.qualitative_analysis_findings ? 'complete' : 'pending',
              icon: Eye,
              color: 'purple',
              output: data.qualitative_analysis_findings || []
            },
            {
              id: '4',
              persona: 'Forensic Accountant',
              title: '4. Estimating Financial Impact',
              status: data.dollar_impact_summary?.error ? 'error' : data.dollar_impact_summary ? 'complete' : 'pending',
              icon: BarChart3,
              color: 'green',
              output: data.dollar_impact_summary ? [
                `Estimated Impact Range: ${data.dollar_impact_summary.estimated_impact_range.join(' - ')}`,
                `Summary: ${data.dollar_impact_summary.summary_of_impact}`,
                ...data.dollar_impact_summary.key_contributing_factors
              ] : []
            },
            {
              id: '5',
              persona: 'Real Estate Paralegal',
              title: '5. Citing Rules & Regulations',
              status: data.cited_red_flags?.error ? 'error' : data.cited_red_flags ? 'complete' : 'pending',
              icon: Scale,
              color: 'red',
              output: data.cited_red_flags ? data.cited_red_flags.map((flag: any) => `${flag.flag.details} - ${flag.citation}`) : []
            },
            {
              id: '6',
              persona: 'Lead Analyst',
              title: '6. Synthesizing Final Report',
              status: data.executive_summary?.error ? 'error' : data.executive_summary ? 'complete' : 'pending',
              icon: Brain,
              color: 'indigo',
              output: data.executive_summary ? [data.executive_summary, ...data.strategic_recommendations] : []
            },
            {
              id: '7',
              persona: 'Dispute Drafter & Compliance Officer',
              title: '7. Generating Your Dispute Letter',
              status: data.dispute_letter?.error ? 'error' : data.dispute_letter ? 'complete' : 'pending',
              icon: FileCheck,
              color: 'pink',
              output: data.dispute_letter ? [
                `Dispute Strength Score: ${data.compliance_review.dispute_strength_score}/10`,
                ...data.compliance_review.strengths,
                ...data.compliance_review.weaknesses
              ] : []
            }
          ];
          setActiveAgents(agentData);
          const completedAgents = agentData.filter(agent => agent.status === 'complete').length;
          const totalAgents = agentData.length;
          setOverallProgress(totalAgents > 0 ? (completedAgents / totalAgents) * 100 : 0);
        }
      });
      return () => unsubscribe();
    }
  }, [selectedReport]);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-orange-400 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleUploadSuccess = (fileId: string) => {
    const newReport = reports.find(report => report.id === fileId);
    if (newReport) {
      setSelectedReport(newReport);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div 
          className="absolute w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transition-all duration-300 ease-out animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}px`,
            top: `${mousePosition.y * 0.01}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
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
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-8" style={{ height: 'calc(100vh - 8rem)' }}>
              {/* Upload Section */}
              <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-orange-400" />
                    Upload New Report
                  </h2>
                  <div className="mb-4">
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                  </div>
                  <Link href="/request" className="w-full">
                    <Button variant="outline" className="w-full border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-orange-500/50 py-2 rounded-xl transition-all duration-300">
                      Don't have the report yet?
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Reports List Section */}
              <div className={`transform transition-all duration-1000 delay-150 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'} flex-grow`}>
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl h-full flex flex-col">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 flex-shrink-0">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Your Reports
                  </h2>
                  <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                    {reports.length > 0 ? reports.map((report, index) => (
                      <div
                        key={report.id}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-orange-300 transition-colors">
                              {report.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(report.status)}
                              <span className="text-xs text-gray-400">{report.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-500 py-10">
                        No reports uploaded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className={`transform transition-all duration-1000 delay-300 ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
                {/* Overall Progress */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-orange-400 animate-pulse" />
                      Multi-Agent Analysis Progress
                    </h2>
                    <div className="text-2xl font-bold text-orange-400 font-mono">
                      {isMounted ? `${Math.round(overallProgress)}%` : '0%'}
                    </div>
                  </div>
                  <Progress value={isMounted ? overallProgress : 0} className="h-3 bg-gray-800" />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{selectedReport ? `Processing ${selectedReport.name}` : 'No report selected'}</span>
                    <span>ETA: 3-6 minutes</span>
                  </div>
                </div>

                {/* Agent Cards Timeline */}
                <div className="space-y-6">
                  {activeAgents.map((agent, index) => (
                    <div 
                      key={agent.id}
                      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl transition-all duration-500 ${
                        agent.status === 'running' ? `border-${agent.color}-500/50 shadow-${agent.color}-500/10` : ''
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${agent.color}-500/20 rounded-xl flex items-center justify-center`}>
                            <agent.icon className={`h-6 w-6 text-${agent.color}-400 ${
                              agent.status === 'running' ? 'animate-pulse' : ''
                            }`} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{agent.persona}</div>
                            <h3 className="text-lg font-semibold text-white">{agent.title}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {agent.status === 'running' && (
                            <div className="flex items-center gap-2 text-orange-400">
                              <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <span className="text-sm">Running...</span>
                            </div>
                          )}
                          {agent.status === 'complete' && (
                            <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm">Complete</span>
                            </div>
                          )}
                          {agent.status === 'pending' && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-5 h-5" />
                              <span className="text-sm">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Live Output */}
                      {agent.output.length > 0 && (
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                          <div className="space-y-2">
                            {agent.output.map((line, lineIndex) => (
                              <div 
                                key={lineIndex}
                                className="text-sm font-mono text-gray-300 flex items-start gap-2"
                                style={{ 
                                  animationDelay: `${lineIndex * 500}ms`,
                                  animation: agent.status === 'running' ? 'fadeInUp 0.5s ease-out' : 'none'
                                }}
                              >
                                {line.includes('✅') && <span className="text-green-400">✅</span>}
                                {line.includes('[✓]') && <span className="text-green-400">[✓]</span>}
                                {line.includes('[!]') && <span className="text-orange-400">[!]</span>}
                                <span className={line.includes('[!]') ? 'text-orange-300' : ''}>{line.replace(/^[✅\[✓\]\[!\]]\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Cards for Final Steps */}
                      {agent.id === '4' && agent.status === 'complete' && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-green-300 text-sm mb-1">Estimated Impact Range</div>
                              <div className="text-2xl font-bold text-green-400">$15,000 - $25,000</div>
                              <div className="text-sm text-green-300 mt-2">
                                Summary: "The valuation appears deflated due to the use of an inappropriate comparable and an unsupported downward adjustment for 'view'."
                              </div>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-400 animate-bounce" />
                          </div>
                        </div>
                      )}

                      {agent.id === '7' && agent.status === 'complete' && (
                        <div className="mt-4 space-y-4">
                          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-300">Generated Dispute Letter</span>
                              <Button size="sm" variant="outline" className="border-gray-600/50 text-gray-300 hover:border-orange-500/50">
                                <Eye className="w-4 h-4 mr-2" />
                                Show Full Letter & Copy
                              </Button>
                            </div>
                            <div className="text-sm text-gray-400 font-mono">
                              "Dear Appraisal Review Board, I am writing to formally dispute the appraisal conducted on my property located at..."
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-blue-300 text-sm mb-1">Dispute Strength Score</div>
                                <div className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                                  9/10
                                  <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                                </div>
                                <div className="text-xs text-blue-300 mt-2">
                                  <div>✓ Maintains a professional tone</div>
                                  <div>✓ Clearly references specific evidence</div>
                                  <div className="text-orange-300">⚠ Could more explicitly state the desired outcome</div>
                                </div>
                              </div>
                              <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}