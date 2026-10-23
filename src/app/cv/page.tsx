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
      desc: 'Single-column high-density layout. Strict ATS section compliance, clear metrics, and monospace metadata.',
      icon: Code2,
      badge: 'STANDARD ATS',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tag: 'Best for Distributed Systems, Backend & Core Dev',
    },
    {
      id: 'modern',
      name: 'Modern (Silicon Valley)',
      desc: 'Dynamic 2-tone header with accent bar, structured skill chips, and clear section hierarchy.',
      icon: Layout,
      badge: 'HIGH SIGNAL',
      badgeColor: 'bg-blue-50 text-[#1b59f8] border-blue-200',
      tag: 'Best for Full-Stack, Product & Startup Roles',
    },
    {
      id: 'minimal',
      name: 'Minimal (Nordic Clean)',
      desc: 'High-contrast typography, generous whitespace, and laser-focused bullet point readability.',
      icon: Minimize2,
      badge: 'TIMELESS',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      tag: 'Best for Senior Engineers & Architects',
    },
    {
      id: 'academic',
      name: 'Academic (Research / MCA)',
      desc: 'Formal institutional structure prioritizing academic thesis, peer-reviewed publications, and GPA.',
      icon: BookOpen,
      badge: 'RESEARCH TIER',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      tag: 'Best for Masters, PhD & Lab Internships',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rule-Based ATS Section &amp; Keyword Validator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Campus CV Studio &amp; ATS Analyzer
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Create high-signal developer resumes backed by real, verifiable campus projects or scan your current CV to identify missing keywords.
          </p>

          <div className="pt-2">
            <Link
              href="/cv/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-amber-400" />
              <span>Launch Live Interactive CV Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dual Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Interactive Builder */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#1b59f8]/40 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#1b59f8] flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1b59f8]">Mode 1 • Real-Time Creation</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Interactive CV Builder Studio
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build your resume step-by-step with rule-based ATS verification. Choose between 4 clean templates, edit education and experiences, and attach verified campus works.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Rule-Based ATS Section &amp; Heading Checklist</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Auto-import verified campus works &amp; skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>One-click PDF print &amp; JSON-Resume export</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cv/builder"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <span>Open CV Builder Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Option 2: Resume Upload & Scanner */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">Mode 2 • Extraction Engine</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Upload &amp; Scan Existing Resume
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Already have a resume? Upload your PDF or DOCX file. Our parser extracts your work history and technical competencies into a staging screen for profile sync.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated skill &amp; keyword extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Format weakness &amp; action verb analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Selectively sync extracted items to profile</span>
                </li>
              </ul>
            </div>

            <Link
              href="/cv/upload"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              <span>Upload Existing CV File</span>
              <Upload className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* 4 ATS Templates Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1b59f8]">
              <Sparkles className="w-4 h-4" />
              <span>4 ATS-ENGINEERED TEMPLATES INCLUDED</span>
            </div>
            <Link
              href="/cv/builder"
              className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1 font-bold"
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
                  className="rounded-2xl bg-white border border-slate-200/90 p-5 hover:border-[#1b59f8]/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#1b59f8] text-slate-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                        {tmpl.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#1b59f8] transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    {tmpl.tag}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ATS Tips & Standards */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1b59f8]">
            <Sparkles className="w-4 h-4" />
            <span>THE 4 GOLDEN ATS CRITERIA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70">
              <h4 className="font-bold text-xs text-slate-900">1. Quantified Impact</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Use metrics: &quot;Reduced latency by 42%&quot;, &quot;Handled 10k requests&quot;.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70">
              <h4 className="font-bold text-xs text-slate-900">2. Action Verbs</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Start bullets with Engineered, Architected, Deployed, Benchmarked.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70">
              <h4 className="font-bold text-xs text-slate-900">3. Standard Headings</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Clear sections: Experience, Education, Projects, Skills.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70">
              <h4 className="font-bold text-xs text-slate-900">4. Technical Density</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Include explicit libraries, languages, and protocols used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
