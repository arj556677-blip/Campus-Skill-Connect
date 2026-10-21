import React from 'react';
import Link from 'next/link';
import { FileText, Sparkles, Upload, CheckCircle2, ArrowRight, Zap, Code2, Layout, BookOpen, Minimize2 } from 'lucide-react';

export const metadata = {
  title: 'CV Studio & ATS Optimizer — Campus Skill Connect',
  description: 'Build ATS-proof student resumes and scan existing CVs to sync verified campus works.',
};

export default function CvHubPage() {
  const templates = [
    {
      id: 'technical',
      name: 'Technical (FAANG / Systems)',
      desc: 'Single-column high-density layout. Strict ATS parser compliance, bold metrics, and monospace metadata.',
      icon: Code2,
      badge: '98% ATS MATCH',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      tag: 'Best for Distributed Systems, Backend & Core Dev',
    },
    {
      id: 'modern',
      name: 'Modern (Silicon Valley)',
      desc: 'Dynamic 2-tone header with violet accent bar, structured skill chips, and clear section hierarchy.',
      icon: Layout,
      badge: 'HIGH SIGNAL',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      tag: 'Best for Full-Stack, Product & Startup Roles',
    },
    {
      id: 'minimal',
      name: 'Minimal (Nordic Clean)',
      desc: 'High-contrast typography, generous whitespace, and laser-focused bullet point readability.',
      icon: Minimize2,
      badge: 'TIMELESS',
      badgeColor: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
      tag: 'Best for Senior Engineers & Architects',
    },
    {
      id: 'academic',
      name: 'Academic (Research / MCA)',
      desc: 'Formal institutional structure prioritizing academic thesis, peer-reviewed publications, and GPA.',
      icon: BookOpen,
      badge: 'RESEARCH TIER',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      tag: 'Best for Masters, PhD & Lab Internships',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ATS Engine V2.0 • 98% Parser Compatibility</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Campus CV Studio &amp; ATS Analyzer
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create high-signal developer resumes backed by real, verifiable campus projects or scan your current CV to identify missing keywords.
          </p>

          <div className="pt-2">
            <Link
              href="/cv/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              <span>Launch Live Interactive CV Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dual Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Interactive Builder */}
          <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-8 flex flex-col justify-between space-y-6 shadow-2xl hover:border-violet-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Mode 1 • Real-Time Creation</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Interactive CV Builder Studio
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Build your resume step-by-step with real-time ATS scoring. Choose between 4 clean templates, edit all education and experiences, and auto-sync verified campus works.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time ATS Score Gauge (0-100)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Auto-import verified campus works &amp; skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>One-click PDF print &amp; JSON-Resume export</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cv/builder"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
            >
              <span>Open CV Builder Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Option 2: Resume Upload & Scanner */}
          <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-8 flex flex-col justify-between space-y-6 shadow-2xl hover:border-cyan-500/40 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">Mode 2 • Extraction Engine</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Upload &amp; Scan Existing Resume
                </h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Already have a resume? Upload your PDF or DOCX file. Our parser extracts your work history and technical competencies into a staging screen for profile sync.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated skill &amp; keyword extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Format weakness &amp; action verb analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Selectively sync extracted items to profile</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cv/upload"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white text-xs font-bold active:scale-95 transition-all"
            >
              <span>Upload Existing CV File</span>
              <Upload className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* 4 ATS Templates Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
              <Sparkles className="w-4 h-4" />
              <span>4 ATS-ENGINEERED TEMPLATES INCLUDED</span>
            </div>
            <Link
              href="/cv/builder"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
            >
              <span>Explore All in Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <Link
                  key={tmpl.id}
                  href={`/cv/builder?template=${tmpl.id}`}
                  className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 hover:border-violet-500/50 hover:bg-white/[0.03] transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-violet-600/20 group-hover:text-violet-300 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                        {tmpl.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-500">
                    {tmpl.tag}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ATS Tips & Standards */}
        <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
            <Sparkles className="w-4 h-4" />
            <span>THE 4 GOLDEN ATS CRITERIA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06]">
              <h4 className="font-bold text-xs text-white">1. Quantified Impact</h4>
              <p className="mt-1 text-[11px] text-zinc-400">
                Use metrics: &quot;Reduced latency by 42%&quot;, &quot;Handled 10k requests&quot;.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06]">
              <h4 className="font-bold text-xs text-white">2. Action Verbs</h4>
              <p className="mt-1 text-[11px] text-zinc-400">
                Start bullets with Engineered, Architected, Deployed, Benchmarked.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06]">
              <h4 className="font-bold text-xs text-white">3. Standard Headings</h4>
              <p className="mt-1 text-[11px] text-zinc-400">
                Clear sections: Experience, Education, Projects, Skills.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06]">
              <h4 className="font-bold text-xs text-white">4. Technical Density</h4>
              <p className="mt-1 text-[11px] text-zinc-400">
                Include explicit libraries, languages, and protocols used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
