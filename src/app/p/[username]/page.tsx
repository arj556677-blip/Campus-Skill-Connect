import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Globe,
  Mail,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  CheckCircle2,
  FileText,
  Star,
  GitBranch,
  Eye,
  Share2,
  Lock,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/SocialIcons';

export const dynamic = 'force-dynamic';

// ─── STRICT TYPESCRIPT INTERFACES ──────────────────────────────────────────

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Proficient' | 'Familiar';
  verified: boolean;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  category: 'Systems Architecture' | 'AI & Machine Learning' | 'Distributed Systems' | 'UI/UX Design' | 'Cloud & DevOps';
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  figmaUrl?: string;
  starsCount?: number;
  forksCount?: number;
  metrics?: string;
  verifiedCommitHash?: string;
  publishedDate: string;
  featured?: boolean;
}

export interface AcademicAttestation {
  degree: string;
  department: string;
  institutionName: string;
  institutionDomain: string;
  isDomainVerified: boolean;
  batchYear: string;
  gpaOrHonors?: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  location: string;
  availabilityStatus: string;
  academic: AcademicAttestation;
  socialLinks: {
    github?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
  skills: SkillCategory[];
  showcaseItems: ShowcaseItem[];
  stats: {
    verifiedWorksCount: number;
    peerEndorsements: number;
    campusNetworkCount: number;
  };
}

// ─── MOCK DATA FETCHER (Drop-in ready before Supabase hookup) ───────────────

async function getPublicPortfolioData(username: string): Promise<PublicProfile | null> {
  const normalized = username.toLowerCase().replace('@', '');

  // High-fidelity fallback portfolio persona matching Campus Skill Connect
  const profile: PublicProfile = {
    id: `usr-${normalized}`,
    username: normalized,
    displayName: normalized === 'alexrivera' ? 'Alex Rivera' : normalized.charAt(0).toUpperCase() + normalized.slice(1),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    headline: 'Distributed Systems Researcher & Full-Stack Architect',
    bio: 'MCA final-year researcher exploring high-throughput distributed consensus protocols, WebRTC audio/data meshes, and cryptographic proof-of-work link verification. Passionate about systems engineering and open-source software.',
    location: 'Bangalore, India',
    availabilityStatus: 'Open to Fall 2026 SDE Roles & Research Sprints',
    academic: {
      degree: 'Master of Computer Applications (MCA)',
      department: 'Computational & Data Sciences',
      institutionName: 'Indian Institute of Science (IISc)',
      institutionDomain: 'iisc.ac.in',
      isDomainVerified: true,
      batchYear: 'Class of 2026',
      gpaOrHonors: "Dean's Research Merit List (Top 2%)",
    },
    socialLinks: {
      github: `https://github.com/${normalized}`,
      linkedin: `https://linkedin.com/in/${normalized}`,
      website: `https://${normalized}.dev`,
      email: `${normalized}@campus.edu`,
    },
    skills: [
      {
        category: 'Core & Systems',
        items: [
          { name: 'Rust', level: 'Expert', verified: true },
          { name: 'Distributed Systems', level: 'Expert', verified: true },
          { name: 'TypeScript', level: 'Expert', verified: true },
          { name: 'Go', level: 'Proficient', verified: true },
          { name: 'C++', level: 'Proficient', verified: false },
        ],
      },
      {
        category: 'Web & Architecture',
        items: [
          { name: 'Next.js 16 (App Router)', level: 'Expert', verified: true },
          { name: 'React 19', level: 'Expert', verified: true },
          { name: 'WebRTC Mesh', level: 'Proficient', verified: true },
          { name: 'Tailwind CSS', level: 'Expert', verified: true },
          { name: 'GraphQL & REST APIs', level: 'Proficient', verified: true },
        ],
      },
      {
        category: 'Data & Infrastructure',
        items: [
          { name: 'PostgreSQL & RLS', level: 'Expert', verified: true },
          { name: 'Upstash / Redis', level: 'Proficient', verified: true },
          { name: 'Docker & Microservices', level: 'Proficient', verified: true },
          { name: 'AWS & Cloud Architecture', level: 'Familiar', verified: false },
        ],
      },
    ],
    showcaseItems: [
      {
        id: 'work-1',
        title: 'Raft Consensus Protocol Engine in Rust',
        description: 'A production-grade distributed key-value store implementing Raft leader election, logarithmic state compaction, and network partition recovery with zero unsafe memory allocations.',
        category: 'Distributed Systems',
        tags: ['Rust', 'Tokio', 'Raft', 'Distributed Systems', 'gRPC'],
        githubUrl: 'https://github.com/alexrivera/raft-distributed-consensus',
        liveUrl: 'https://raft-engine.demo.campus.edu',
        paperUrl: 'https://arxiv.org/abs/sample-raft-proof',
        starsCount: 342,
        forksCount: 48,
        metrics: 'Sub-5ms leader failover • 12,000 tx/sec throughput',
        verifiedCommitHash: '7f2e1a4',
        publishedDate: 'October 2026',
        featured: true,
      },
      {
        id: 'work-2',
        title: 'Campus Peer Mesh: Zero-Latency WebRTC Data Relay',
        description: 'Decentralized peer-to-peer audio and bidirectional collaborative coding engine designed for campus networks. Uses STUN/TURN fallback with automated DTLS/SRTP encryption.',
        category: 'Systems Architecture',
        tags: ['WebRTC', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind'],
        githubUrl: 'https://github.com/alexrivera/campus-peer-mesh',
        liveUrl: 'https://peer-mesh.campus.edu',
        starsCount: 189,
        forksCount: 22,
        metrics: '99.98% packet delivery • E2E encrypted',
        verifiedCommitHash: '9c4b810',
        publishedDate: 'September 2026',
        featured: true,
      },
      {
        id: 'work-3',
        title: 'Multimodal Radiology Assistant & Segmentation Pipeline',
        description: 'Vision-language foundation model pipeline evaluating chest radiographs with spatial attention bounding boxes and structured diagnostic summaries for medical peer review.',
        category: 'AI & Machine Learning',
        tags: ['PyTorch', 'Python', 'Computer Vision', 'CUDA', 'FastAPI'],
        githubUrl: 'https://github.com/alexrivera/med-radiology-vision',
        paperUrl: 'https://ieee.org/symposium/2025/radiology-assistant',
        starsCount: 94,
        forksCount: 12,
        metrics: '94.2% Dice similarity score • IEEE Student Paper',
        verifiedCommitHash: '3a88d12',
        publishedDate: 'August 2026',
        featured: false,
      },
      {
        id: 'work-4',
        title: 'Rule-Based ATS Resume Verification Studio',
        description: 'Structural parser and ATS consistency auditor that checks contact clarity, single-column alignment, and strong engineering action verbs without fabricated AI percentage scores.',
        category: 'Cloud & DevOps',
        tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
        githubUrl: 'https://github.com/alexrivera/ats-resume-studio',
        liveUrl: 'https://ats-studio.campus.edu',
        starsCount: 215,
        forksCount: 31,
        metrics: '100% deterministic rule analysis',
        verifiedCommitHash: '6d11f0a',
        publishedDate: 'July 2026',
        featured: false,
      },
    ],
    stats: {
      verifiedWorksCount: 4,
      peerEndorsements: 38,
      campusNetworkCount: 142,
    },
  };

  return profile;
}

// ─── NEXT.JS 16 SERVER COMPONENT ───────────────────────────────────────────

interface PublicPortfolioProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PublicPortfolioProps) {
  const { username } = await params;
  const profile = await getPublicPortfolioData(username);

  if (!profile) {
    return {
      title: 'Portfolio Not Found — Campus Skill Connect',
    };
  }

  return {
    title: `${profile.displayName} (@${profile.username}) — Verified Public Portfolio`,
    description: profile.headline,
    openGraph: {
      title: `${profile.displayName} | Campus Skill Connect Portfolio`,
      description: profile.bio,
      images: [profile.avatarUrl],
    },
  };
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const { username } = await params;
  const profile = await getPublicPortfolioData(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-300 font-sans antialiased">
      
      {/* ── BACKGROUND AMBIENT GLOWS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* ── TOP UTILITY BAR: Navigation & Share ── */}
        <header className="flex items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[10px] font-bold">
              CS
            </div>
            <span>Campus Skill Connect</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Public Proof
            </span>

            <a
              href={`mailto:${profile.socialLinks.email || ''}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Candidate</span>
            </a>
          </div>
        </header>

        {/* ── 1. HERO HEADER: Avatar, Verification Badge, Bio & Links ── */}
        <section className="relative rounded-3xl bg-[#1C1F26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle Top Border Gradient Accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            
            {/* Avatar with Verified Ring */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 border-2 border-white/[0.1] shadow-xl bg-slate-800">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 text-white font-bold text-2xl flex items-center justify-center">
                    {profile.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Verified Institutional Ribbon Badge */}
              <div
                title="Institutional Domain Verified"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-3 border-[#1C1F26] flex items-center justify-center shadow-lg text-white"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Profile Info & Verification Details */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  <span className="text-xs font-mono text-slate-400">
                    @{profile.username}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-indigo-300">
                  {profile.headline}
                </p>
              </div>

              {/* Institutional Attestation Pill */}
              <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profile.academic.institutionName}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>@{profile.academic.institutionDomain}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* Bio Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                {profile.bio}
              </p>

              {/* Availability Notice */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-slate-200">{profile.availabilityStatus}</span>
              </div>

              {/* Social and External Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Portfolio Site</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {profile.socialLinks.email && (
                  <a
                    href={`mailto:${profile.socialLinks.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email</span>
                  </a>
                )}
              </div>

            </div>

          </div>

          {/* Quick Metrics Ribbon inside Hero */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xl sm:text-2xl font-black text-white">{profile.stats.verifiedWorksCount}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Verified Works</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xl sm:text-2xl font-black text-indigo-400">100%</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Link-Verified</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xl sm:text-2xl font-black text-white">{profile.stats.peerEndorsements}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Peer Endorsements</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xl sm:text-2xl font-black text-emerald-400">{profile.stats.campusNetworkCount}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Campus Peers</p>
            </div>
          </div>
        </section>

        {/* ── 2. ACTIVE SKILLS SECTION (Categorized Glassmorphism Grid) ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Technical Competencies &amp; Verified Skills
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Database Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.skills.map((categoryGroup, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#1C1F26]/90 border border-white/[0.08] p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                    {categoryGroup.category}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {categoryGroup.items.length} skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categoryGroup.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/30 transition-all text-xs group"
                    >
                      <span className="text-slate-200 group-hover:text-white font-medium">
                        {skill.name}
                      </span>
                      {skill.verified && (
                        <span
                          title="Verified via submitted repository commits"
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. PROOF OF WORK (Masonry / Cards Layout) ── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Verified Proof of Work ({profile.showcaseItems.length})
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Link-first evidence backed by signed repository commit hashes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {profile.showcaseItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-[#1C1F26]/90 border border-white/[0.08] hover:border-indigo-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.category}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.publishedDate}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Metrics Badge if present */}
                  {item.metrics && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-indigo-200/90 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{item.metrics}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.04]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Links and Git Details */}
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                  {/* Verification & Stars */}
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    {item.verifiedCommitHash && (
                      <span
                        title="Cryptographically verified commit hash"
                        className="inline-flex items-center gap-1 text-emerald-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>#{item.verifiedCommitHash}</span>
                      </span>
                    )}

                    {item.starsCount && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{item.starsCount}</span>
                      </span>
                    )}
                  </div>

                  {/* Action Link Buttons */}
                  <div className="flex items-center gap-2">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                        title="Inspect GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {item.paperUrl && (
                      <a
                        href={item.paperUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                        title="Read Manuscript Paper"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                      </a>
                    )}

                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. ACADEMIC CREDENTIALS & UNIVERSITY ATTESTATION ── */}
        <section className="rounded-3xl bg-[#1C1F26]/90 border border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Academic Attestation &amp; Verification Record
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Institutional Membership</span>
              <p className="text-sm font-bold text-white">{profile.academic.institutionName}</p>
              <p className="text-slate-400">{profile.academic.department} • {profile.academic.batchYear}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Domain Verification Status</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Accredited Campus Domain (@{profile.academic.institutionDomain})</span>
              </div>
              <p className="text-slate-400 font-mono text-[11px]">{profile.academic.gpaOrHonors}</p>
            </div>
          </div>
        </section>

        {/* ── 5. FOOTER & COPYRIGHT ── */}
        <footer className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>

          <div>
            <span>Generated via </span>
            <Link href="/" className="text-indigo-400 hover:underline font-bold">
              Campus Skill Connect
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
