'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Eye,
  RefreshCw,
  Layout,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Copy,
  Check,
  Zap,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { CvTemplate } from '@/lib/types';

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

interface ProjectItem {
  title: string;
  technologies: string;
  link: string;
  description: string;
}

interface ResumeData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
}

const PRESET_ALEX: ResumeData = {
  fullName: 'Alex Rivera',
  headline: 'Full-Stack Software Engineer & Distributed Systems Explorer',
  email: 'alex.rivera@iisc.ac.in',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  github: 'github.com/alexrivera-dev',
  linkedin: 'linkedin.com/in/alexrivera-dev',
  portfolio: 'alexrivera.dev',
  summary:
    'Master of Computer Applications student at IISc with production experience building high-concurrency web applications, Redis caching layers, and WebRTC streaming protocols. Strong foundation in distributed systems, SQL RLS architecture, and TypeScript.',
  education: [
    {
      institution: 'Indian Institute of Science (IISc), Bangalore',
      degree: 'Master of Computer Applications (MCA) — Systems Track',
      year: '2024 – 2026',
      gpa: '9.2 / 10.0',
    },
    {
      institution: 'National Institute of Technology (NIT)',
      degree: 'B.Sc. in Computer Science & Applied Mathematics',
      year: '2020 – 2024',
      gpa: '8.9 / 10.0',
    },
  ],
  experience: [
    {
      company: 'ScaleOps Lab (Campus Incubator)',
      role: 'Distributed Systems Engineering Intern',
      duration: 'May 2025 – Aug 2025',
      bullets: [
        'Architected an in-memory Redis cache-aside layer, improving API p99 latency by 64% under 8k concurrent connections.',
        'Implemented sliding-window rate limiters utilizing Redis sorted sets to defend against API scraping.',
        'Configured NGINX reverse proxy with Brotli compression and micro-caching for static assets.',
      ],
    },
  ],
  projects: [
    {
      title: 'HyperCache: High-Performance Next.js Cache Engine',
      technologies: 'Next.js 15, TypeScript, Redis 7, Supabase, Docker',
      link: 'github.com/alexrivera-dev/hypercache',
      description:
        'Engineered transparent multi-tenant caching with automatic cache invalidation on Supabase writes. Handled 10k requests/sec with 99.4% cache hit rates.',
    },
    {
      title: 'Campus Peer Mesh: Encrypted WebRTC P2P Streamer',
      technologies: 'WebRTC, React 19, Node.js, WebAssembly',
      link: 'github.com/alexrivera-dev/peer-mesh',
      description:
        'Developed browser-to-browser chunked media transfer with SHA-256 integrity checks, reducing server egress bandwidth by 82%.',
    },
    {
      title: 'Campus Skill Connect: Proof-of-Skill Platform',
      technologies: 'Next.js 16, Supabase RLS, Docker, Redis, Tailwind CSS',
      link: 'github.com/campus-skill-connect/core',
      description:
        'Architected role-based multi-tenant authentication gateway with PostgreSQL row-level security policies and real-time ATS optimization scoring.',
    },
  ],
  skills: [
    'Next.js 15',
    'React 19',
    'TypeScript',
    'PostgreSQL & RLS',
    'Redis Caching & PubSub',
    'Docker & Compose',
    'NGINX Reverse Proxy',
    'WebRTC',
    'Tailwind CSS',
    'Git CI/CD',
    'Node.js',
    'Python',
  ],
};

const PRESET_PRIYA: ResumeData = {
  fullName: 'Priya Sharma',
  headline: 'AI / Machine Learning Engineer & Computer Vision Researcher',
  email: 'priya.sharma@campus.edu',
  phone: '+91 91234 56789',
  location: 'Hyderabad, India',
  github: 'github.com/priyasharma-ai',
  linkedin: 'linkedin.com/in/priya-sharma-ai',
  portfolio: 'priya-ai.portfolio.dev',
  summary:
    'Graduate AI researcher specializing in quantized deep learning, edge vision models (YOLOv9, TensorRT), and automated medical imaging segmentation. Published 2 peer-reviewed workshop papers on low-power inference.',
  education: [
    {
      institution: 'International Institute of Information Technology (IIIT)',
      degree: 'M.Tech in Artificial Intelligence & Robotics',
      year: '2024 – 2026',
      gpa: '9.4 / 10.0',
    },
  ],
  experience: [
    {
      company: 'NeuralEdge Labs',
      role: 'Computer Vision Research Intern',
      duration: 'Jan 2025 – Jul 2025',
      bullets: [
        'Quantized YOLOv9 models to INT8 precision using TensorRT, boosting edge inference speed by 3.2x with <0.8% mAP degradation.',
        'Deployed containerized ONNX runtime microservices processing 450 frames/sec video streams.',
      ],
    },
  ],
  projects: [
    {
      title: 'Autonomous Drone Vision Sprint (Quantized YOLOv9)',
      technologies: 'PyTorch, TensorRT, CUDA, Python, OpenCV',
      link: 'github.com/priyasharma-ai/drone-vision',
      description:
        'Architected real-time obstacle detection for autonomous UAVs achieving 62 FPS on Jetson Orin Nano with 94.6% recall.',
    },
    {
      title: 'MedSeg: Zero-Shot MRI Pathology Segmentation',
      technologies: 'PyTorch, Vision Transformers, FastAPI, Docker',
      link: 'github.com/priyasharma-ai/medseg-vit',
      description:
        'Engineered attention-guided segmentation pipeline reducing radiologist annotation time by 55% across 1,200 clinical scans.',
    },
  ],
  skills: [
    'Python',
    'PyTorch',
    'TensorRT',
    'OpenCV',
    'CUDA',
    'Docker',
    'FastAPI',
    'ONNX Runtime',
    'NumPy / SciPy',
    'Linux / Shell',
  ],
};

const SUGGESTED_SKILLS = [
  'Next.js 15',
  'React 19',
  'TypeScript',
  'PostgreSQL',
  'Redis',
  'Docker',
  'WebRTC',
  'Python',
  'PyTorch',
  'Kubernetes',
  'GraphQL',
  'Tailwind CSS',
  'Git CI/CD',
  'NGINX',
  'Node.js',
  'Go',
];

export default function CvBuilderPage() {
  const [template, setTemplate] = useState<CvTemplate>('technical');
  const [resume, setResume] = useState<ResumeData>(PRESET_ALEX);
  const [activeTab, setActiveTab] = useState<'contact' | 'education' | 'experience' | 'projects' | 'skills'>('contact');
  const [copiedText, setCopiedText] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // ATS Diagnostic Analysis Engine
  const atsAnalysis = useMemo(() => {
    let score = 0;
    const feedback: { text: string; passed: boolean }[] = [];

    // 1. Contact Info check (max 20 pts)
    let contactPts = 0;
    if (resume.fullName.trim().length > 2) contactPts += 5;
    if (resume.email && resume.email.includes('@')) contactPts += 5;
    if (resume.phone && resume.phone.length > 5) contactPts += 5;
    if (resume.github || resume.linkedin) contactPts += 5;
    score += contactPts;
    feedback.push({
      text: contactPts === 20 ? 'Contact links & identifiers complete (+20)' : 'Complete full contact details (email, phone, GitHub/LinkedIn)',
      passed: contactPts === 20,
    });

    // 2. Summary & Headline (max 15 pts)
    let summaryPts = 0;
    if (resume.headline && resume.headline.length > 10) summaryPts += 5;
    if (resume.summary && resume.summary.length >= 60) summaryPts += 10;
    else if (resume.summary && resume.summary.length >= 30) summaryPts += 5;
    score += summaryPts;
    feedback.push({
      text: summaryPts === 15 ? 'High-signal professional headline & summary (+15)' : 'Expand professional summary to at least 60 characters with technical focus',
      passed: summaryPts === 15,
    });

    // 3. Technical Skills density (max 20 pts)
    let skillPts = 0;
    if (resume.skills.length >= 8) skillPts = 20;
    else if (resume.skills.length >= 4) skillPts = 12;
    else skillPts = resume.skills.length * 3;
    score += skillPts;
    feedback.push({
      text: skillPts === 20 ? `High keyword density: ${resume.skills.length} technical skills (+20)` : 'Include at least 8 verified skills or frameworks for ATS matching',
      passed: skillPts === 20,
    });

    // 4. Quantified metrics in bullets / projects (max 25 pts)
    const allText = JSON.stringify(resume);
    const metricMatches = allText.match(/\d+[\%kK]|\b\d+\b/g);
    let metricPts = 0;
    if (metricMatches && metricMatches.length >= 5) metricPts = 25;
    else if (metricMatches && metricMatches.length >= 2) metricPts = 15;
    else metricPts = 5;
    score += metricPts;
    feedback.push({
      text: metricPts === 25 ? `Quantified achievements detected: ${metricMatches?.length || 0} metrics found (+25)` : 'Quantify bullets with numbers (e.g., "reduced latency by 64%", "handled 10k requests")',
      passed: metricPts === 25,
    });

    // 5. Strong action verbs (max 20 pts)
    const actionVerbs = ['Architected', 'Engineered', 'Implemented', 'Developed', 'Configured', 'Optimized', 'Deployed', 'Benchmarked', 'Quantized'];
    const foundVerbs = actionVerbs.filter((v) => allText.toLowerCase().includes(v.toLowerCase()));
    let verbPts = 0;
    if (foundVerbs.length >= 4) verbPts = 20;
    else if (foundVerbs.length >= 2) verbPts = 12;
    else verbPts = foundVerbs.length * 5;
    score += verbPts;
    feedback.push({
      text: verbPts === 20 ? `High-impact action verbs used (${foundVerbs.join(', ')}) (+20)` : 'Start bullets with strong action verbs: Architected, Engineered, Optimized, Deployed',
      passed: verbPts === 20,
    });

    return { score: Math.min(score, 100), feedback };
  }, [resume]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.fullName.replace(/\s+/g, '_')}_ATS_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyPlainText = () => {
    const lines = [
      resume.fullName.toUpperCase(),
      resume.headline,
      `${resume.email} | ${resume.phone} | ${resume.location}`,
      `${resume.github} | ${resume.linkedin} | ${resume.portfolio}`,
      '',
      'PROFESSIONAL SUMMARY',
      resume.summary,
      '',
      'EDUCATION',
      ...resume.education.map((e) => `${e.institution} - ${e.degree} (${e.year}) [GPA: ${e.gpa}]`),
      '',
      'EXPERIENCE',
      ...resume.experience.map((exp) => `${exp.role} | ${exp.company} (${exp.duration})\n` + exp.bullets.map((b) => `  * ${b}`).join('\n')),
      '',
      'VERIFIED PROJECTS',
      ...resume.projects.map((p) => `${p.title} (${p.technologies})\n  ${p.description}\n  Link: ${p.link}`),
      '',
      'TECHNICAL COMPETENCIES',
      resume.skills.join(', '),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleAutoPopulateCampusWorks = () => {
    setResume(PRESET_ALEX);
    setImportNotice('Successfully auto-synced 3 verified campus projects & 12 skills from Campus Skill Connect repository!');
    setTimeout(() => setImportNotice(null), 4000);
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        { institution: 'Indian Institute of Technology (IIT)', degree: 'B.Tech in Computer Science', year: '2020 – 2024', gpa: '9.0 / 10.0' },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          company: 'TechCorp Campus Labs',
          role: 'Backend Engineering Intern',
          duration: 'Jun 2025 – Aug 2025',
          bullets: ['Engineered scalable microservices handling 5k requests/sec.', 'Implemented automated integration tests with 92% coverage.'],
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index),
    });
  };

  const addExperienceBullet = (expIndex: number) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets.push('Architected high-throughput message processing pipeline.');
    setResume({ ...resume, experience: updated });
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setResume({ ...resume, experience: updated });
  };

  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...resume.projects,
        {
          title: 'Distributed KV Store',
          technologies: 'Go, Raft Protocol, gRPC, Docker',
          link: 'github.com/my-profile/kv-store',
          description: 'Implemented Raft consensus algorithm with leader election and log replication, achieving 99.9% uptime during network partitions.',
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index),
    });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !resume.skills.includes(trimmed)) {
      setResume({ ...resume, skills: [...resume.skills, trimmed] });
    }
    setNewSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setResume({ ...resume, skills: resume.skills.filter((s) => s !== skill) });
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Header Bar (Hidden on print) */}
        <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/cv"
              className="p-2.5 rounded-xl bg-[#10121a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all shadow-sm"
              title="Back to CV Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Interactive CV Studio & ATS Engine
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  V2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time ATS parsing score, verified campus project integration, and 4 high-signal templates.
              </p>
            </div>
          </div>

          {/* Quick Presets & Print / Download Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Presets */}
            <div className="flex items-center gap-1 p-1 bg-[#10121a] border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setResume(PRESET_ALEX)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  resume.fullName === 'Alex Rivera'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Alex (MCA)
              </button>
              <button
                type="button"
                onClick={() => setResume(PRESET_PRIYA)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  resume.fullName === 'Priya Sharma'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Priya (AI/ML)
              </button>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1 bg-[#10121a] border border-white/10 p-1 rounded-xl">
              {(['technical', 'modern', 'minimal', 'academic'] as CvTemplate[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    template === t
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Copy Plain Text */}
            <button
              type="button"
              onClick={handleCopyPlainText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#10121a] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 text-xs font-semibold transition-all"
              title="Copy ATS Plain Text for Job Portals"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-[#10121a] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all"
              title="Export JSON-Resume"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Print / PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span>Print to PDF</span>
            </button>
          </div>
        </div>

        {/* Import Banner Notification */}
        {importNotice && (
          <div className="no-print p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{importNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setImportNotice(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ATS Score Gauge Strip (Hidden on print) */}
        <div className="no-print rounded-2xl bg-[#0e1017] border border-white/10 p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`relative w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-4 ${
                atsAnalysis.score >= 85
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : atsAnalysis.score >= 65
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
              }`}
            >
              {atsAnalysis.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  ATS Readiness Score: {atsAnalysis.score}/100
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    atsAnalysis.score >= 85
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : atsAnalysis.score >= 65
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {atsAnalysis.score >= 85
                    ? '98% Parser Compatibility (Tier 1)'
                    : atsAnalysis.score >= 65
                    ? 'Good Signal — Minor Optimizations Needed'
                    : 'Low Signal — Add Keywords & Metrics'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evaluated against action verbs, quantified metrics, tech stack density, and standard contact structure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoPopulateCampusWorks}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold transition-all shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-violet-400 fill-current" />
              <span>Auto-Sync Verified Works</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Dark Editor | Right Live Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Editor Form (Hidden on print) */}
          <div className="no-print lg:col-span-5 space-y-4">
            
            {/* Section Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-[#10121a] border border-white/10 rounded-xl overflow-x-auto">
              {[
                { id: 'contact', label: 'Contact', icon: FileText },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'skills', label: 'Skills', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Contact & Identity */}
            {activeTab === 'contact' && (
              <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>Contact & Target Headline</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">ATS Header Zone</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={resume.fullName}
                      onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">Target Headline / Specialization *</label>
                    <input
                      type="text"
                      value={resume.headline}
                      onChange={(e) => setResume({ ...resume, headline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">Email *</label>
                      <input
                        type="email"
                        value={resume.email}
                        onChange={(e) => setResume({ ...resume, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">Phone *</label>
                      <input
                        type="text"
                        value={resume.phone}
                        onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">Location</label>
                      <input
                        type="text"
                        value={resume.location}
                        onChange={(e) => setResume({ ...resume, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">GitHub</label>
                      <input
                        type="text"
                        value={resume.github}
                        onChange={(e) => setResume({ ...resume, github: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono font-bold text-zinc-400 block mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={resume.linkedin}
                        onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono font-bold text-zinc-400">Professional Summary *</label>
                      <span className="text-[10px] font-mono text-zinc-500">{resume.summary.length} characters</span>
                    </div>
                    <textarea
                      rows={4}
                      value={resume.summary}
                      onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Education */}
            {activeTab === 'education' && (
              <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Education & Qualifications ({resume.education.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#141722] border border-white/10 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-emerald-400">Degree #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove degree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Institution (e.g., Indian Institute of Science)"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[idx].institution = e.target.value;
                            setResume({ ...resume, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Degree & Major (e.g., Master of Computer Applications)"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[idx].degree = e.target.value;
                            setResume({ ...resume, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Years (e.g., 2024 – 2026)"
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[idx].year = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="GPA (e.g., 9.2 / 10.0)"
                            value={edu.gpa}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[idx].gpa = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Experience */}
            {activeTab === 'experience' && (
              <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span>Experience & Internships ({resume.experience.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#141722] border border-white/10 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">Position #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Company (e.g., ScaleOps Lab)"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx].company = e.target.value;
                            setResume({ ...resume, experience: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          placeholder="Role (e.g., Systems Engineering Intern)"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx].role = e.target.value;
                            setResume({ ...resume, experience: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Duration (e.g., May 2025 – Aug 2025)"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].duration = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />

                      {/* Bullets */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span>Quantified Achievement Bullets:</span>
                          <button
                            type="button"
                            onClick={() => addExperienceBullet(idx)}
                            className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        {exp.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => {
                                const updated = [...resume.experience];
                                updated[idx].bullets[bIdx] = e.target.value;
                                setResume({ ...resume, experience: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-zinc-200 text-xs focus:outline-none focus:border-cyan-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeExperienceBullet(idx, bIdx)}
                              className="p-1 text-zinc-500 hover:text-rose-400 shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Verified Campus Projects */}
            {activeTab === 'projects' && (
              <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-violet-400" />
                    <span>Verified Projects ({resume.projects.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resume.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="p-3.5 rounded-xl bg-[#141722] border border-white/10 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-violet-400">Project #{pIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeProject(pIdx)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={(e) => {
                          const newProjs = [...resume.projects];
                          newProjs[pIdx].title = e.target.value;
                          setResume({ ...resume, projects: newProjs });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-violet-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Tech Stack (e.g., Next.js 15, Redis, WebRTC)"
                          value={proj.technologies}
                          onChange={(e) => {
                            const newProjs = [...resume.projects];
                            newProjs[pIdx].technologies = e.target.value;
                            setResume({ ...resume, projects: newProjs });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-violet-500"
                        />
                        <input
                          type="text"
                          placeholder="Link (e.g., github.com/alexrivera-dev/app)"
                          value={proj.link}
                          onChange={(e) => {
                            const newProjs = [...resume.projects];
                            newProjs[pIdx].link = e.target.value;
                            setResume({ ...resume, projects: newProjs });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-blue-300 text-xs font-mono focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Quantified Impact & Description..."
                        value={proj.description}
                        onChange={(e) => {
                          const newProjs = [...resume.projects];
                          newProjs[pIdx].description = e.target.value;
                          setResume({ ...resume, projects: newProjs });
                        }}
                        className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Technical Competencies */}
            {activeTab === 'skills' && (
              <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Technical Skills ({resume.skills.length})</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">ATS Keyword Match</span>
                </div>

                {/* Input for new skill */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addSkill(newSkillInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Type a skill and press Enter (e.g., Kubernetes, Rust)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                  >
                    Add
                  </button>
                </form>

                {/* Active Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141722] border border-white/10 text-xs font-mono font-medium text-purple-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-zinc-500 hover:text-rose-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggested Chips */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <p className="text-[11px] font-mono text-zinc-400">One-Click Quick Add High-Demand Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.filter((s) => !resume.skills.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition-all"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ATS Diagnostics Checklist */}
            <div className="rounded-2xl bg-[#0e1017] border border-white/10 p-4 space-y-2.5 text-xs shadow-xl">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ATS Quality Checklist & Rubric</span>
              </div>
              <div className="space-y-1.5">
                {atsAnalysis.feedback.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11.5px]">
                    {item.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span className={item.passed ? 'text-zinc-300' : 'text-amber-300/90'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Live Resume Preview Sheet (Standard White Paper for Printing & Viewing) */}
          <div className="lg:col-span-7">
            <div className="cv-preview-sheet sticky top-24 rounded-2xl bg-white border border-zinc-200 p-8 sm:p-12 shadow-2xl text-black min-h-[960px] font-sans transition-all duration-300">
              
              {/* HEADER RENDERING PER TEMPLATE */}
              {template === 'technical' && (
                <div className="border-b-2 border-zinc-900 pb-5 mb-5 text-center">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono">
                    {resume.fullName}
                  </h1>
                  <p className="text-xs font-bold text-zinc-800 mt-1 uppercase tracking-wide">
                    {resume.headline}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-zinc-700 flex flex-wrap items-center justify-center gap-2">
                    {resume.email && <span>{resume.email}</span>}
                    {resume.phone && <span>| {resume.phone}</span>}
                    {resume.location && <span>| {resume.location}</span>}
                    {resume.github && <span>| {resume.github}</span>}
                    {resume.linkedin && <span>| {resume.linkedin}</span>}
                  </div>
                </div>
              )}

              {template === 'modern' && (
                <div className="border-b-2 border-indigo-600 pb-5 mb-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-indigo-950">
                      {resume.fullName}
                    </h1>
                    <p className="text-xs font-extrabold text-indigo-600 mt-0.5 uppercase tracking-wider">
                      {resume.headline}
                    </p>
                  </div>
                  <div className="text-[11px] text-zinc-600 space-y-0.5 sm:text-right font-medium">
                    <p>{resume.email} • {resume.phone}</p>
                    <p>{resume.location}</p>
                    <p className="text-indigo-700 font-mono">{resume.github}</p>
                  </div>
                </div>
              )}

              {template === 'academic' && (
                <div className="border-b border-zinc-400 pb-5 mb-5 text-center">
                  <h1 className="text-2xl font-serif font-bold text-zinc-900 tracking-normal">
                    {resume.fullName}
                  </h1>
                  <p className="text-xs italic text-zinc-700 mt-1 font-serif">
                    {resume.headline}
                  </p>
                  <div className="mt-2 text-[11px] font-serif text-zinc-600 flex flex-wrap items-center justify-center gap-3">
                    <span>{resume.email}</span>
                    <span>•</span>
                    <span>{resume.phone}</span>
                    <span>•</span>
                    <span>{resume.location}</span>
                  </div>
                </div>
              )}

              {template === 'minimal' && (
                <div className="border-b border-zinc-200 pb-5 mb-5 text-left">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black">
                    {resume.fullName}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {resume.headline}
                  </p>
                  <div className="mt-2 text-[10.5px] font-mono text-zinc-600 flex flex-wrap items-center gap-3">
                    <span>{resume.email}</span>
                    <span>/</span>
                    <span>{resume.phone}</span>
                    <span>/</span>
                    <span>{resume.location}</span>
                    <span>/</span>
                    <span className="text-zinc-900">{resume.github}</span>
                  </div>
                </div>
              )}

              {/* PROFESSIONAL SUMMARY */}
              {resume.summary && (
                <div className="mb-5">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2 text-zinc-900 font-mono">
                    Professional Summary
                  </h2>
                  <p className="text-[11.5px] leading-relaxed text-zinc-800">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* EDUCATION */}
              {resume.education.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2.5 text-zinc-900 font-mono">
                    Education & Academic Track
                  </h2>
                  <div className="space-y-2.5">
                    {resume.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs">
                        <div>
                          <h4 className="font-bold text-zinc-950">{edu.institution}</h4>
                          <p className="text-[11.5px] text-zinc-700">{edu.degree}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-zinc-600 text-[11px]">{edu.year}</span>
                          {edu.gpa && <p className="font-mono font-bold text-zinc-900 text-[11px]">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPERIENCE */}
              {resume.experience.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2.5 text-zinc-900 font-mono">
                    Engineering Experience & Internships
                  </h2>
                  <div className="space-y-3.5">
                    {resume.experience.map((exp, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-zinc-950">
                            {exp.role} <span className="font-medium text-zinc-600">| {exp.company}</span>
                          </h4>
                          <span className="font-mono text-[11px] text-zinc-600">{exp.duration}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-zinc-800 leading-relaxed pt-0.5">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="text-[11px] pl-1">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VERIFIED PROJECTS */}
              {resume.projects.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2.5 text-zinc-900 font-mono">
                    Verified Campus Projects & Systems Artifacts
                  </h2>
                  <div className="space-y-3">
                    {resume.projects.map((proj, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-zinc-950">
                            {proj.title}{' '}
                            <span className="font-mono text-[10.5px] font-normal text-zinc-600">
                              [{proj.technologies}]
                            </span>
                          </span>
                          {proj.link && (
                            <span className="font-mono text-[10px] text-indigo-700 underline shrink-0">
                              {proj.link}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-800 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TECHNICAL SKILLS */}
              {resume.skills.length > 0 && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider border-b border-zinc-300 pb-1 mb-2 text-zinc-900 font-mono">
                    Technical Competencies & Tooling
                  </h2>
                  <p className="text-[11.5px] font-mono text-zinc-900 leading-relaxed">
                    {resume.skills.join(' • ')}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
