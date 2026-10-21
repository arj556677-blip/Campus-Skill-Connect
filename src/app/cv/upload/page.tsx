'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Check,
  Building,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function CvUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    candidateName: string;
    email: string;
    atsScore: number;
    extractedSkills: string[];
    extractedProjects: Array<{ title: string; desc: string }>;
    issues: string[];
  } | null>(null);
  const [synced, setSynced] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsParsing(true);

    // Simulate multi-pass ATS parsing engine
    setTimeout(() => {
      setIsParsing(false);
      setParsedData({
        candidateName: 'Alex Rivera',
        email: 'alex.rivera@iisc.ac.in',
        atsScore: 88,
        extractedSkills: [
          'Next.js 15',
          'TypeScript',
          'Redis PubSub',
          'PostgreSQL',
          'WebRTC',
          'Docker Compose',
          'NGINX',
          'Tailwind CSS',
          'Python',
          'FastAPI',
        ],
        extractedProjects: [
          {
            title: 'HyperCache In-Memory Optimization',
            desc: 'Redis-based query caching layer reducing database latency by 84% under 10k requests/sec.',
          },
          {
            title: 'Campus Peer Mesh WebRTC',
            desc: 'P2P encrypted streaming protocol for high-bandwidth academic video distribution.',
          },
        ],
        issues: [
          'Consider quantifying line 14: Add user counts or latency reduction figures.',
          'Missing certifications section heading in original document.',
        ],
      });
    }, 1200);
  };

  const handleSyncToProfile = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/cv"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CV Studio Hub</span>
          </Link>

          <Link
            href="/cv/builder"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-violet-400 hover:text-violet-300"
          >
            <span>Or use Interactive Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Document Extraction • V2.0</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Upload &amp; Scan Resume for ATS Optimization
          </h1>
          <p className="text-sm text-zinc-400">
            Our multi-pass parser extracts technical competencies, flags ATS formatting flaws, and allows instant staging into your campus portfolio.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="rounded-3xl bg-[#0e1017] border-2 border-dashed border-white/10 hover:border-cyan-500/50 p-10 sm:p-14 text-center shadow-2xl transition-all group"
        >
          <input
            type="file"
            id="cv-file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="cv-file" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
              {isParsing ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-white">
                {isParsing
                  ? 'Parsing resume document & extracting competencies...'
                  : file
                  ? `Selected: ${file.name}`
                  : 'Drag & Drop your resume here, or Browse files'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Supports PDF, DOCX, and Plain Text up to 10MB
              </p>
            </div>
            {!file && !isParsing && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-zinc-200 transition-all">
                Select Resume File
              </span>
            )}
          </label>
        </div>

        {/* Staging & Extraction Results */}
        {parsedData && (
          <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  EXTRACTION COMPLETE
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  Parsed Profile: {parsedData.candidateName}
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Contact: {parsedData.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    ATS Score: {parsedData.atsScore}/100
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSyncToProfile}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  {synced ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Synced to Profile!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Sync All to Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted Skills */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Extracted Technologies &amp; Core Skills ({parsedData.extractedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141722] text-xs font-mono font-semibold text-zinc-200 border border-white/10"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Projects */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Extracted Projects / Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parsedData.extractedProjects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#141722] border border-white/10 space-y-1">
                    <h4 className="font-bold text-xs text-white">{proj.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Feedback Warnings */}
            {parsedData.issues.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>ATS Parser Warnings &amp; Recommendations</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90 font-mono">
                  {parsedData.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Link to CV Builder */}
            <div className="pt-2 flex justify-end">
              <Link
                href="/cv/builder"
                className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300"
              >
                <span>Edit Extracted Data in Interactive Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
