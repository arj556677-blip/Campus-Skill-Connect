export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  FileText,
  Users,
  Video,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Building,
  MapPin,
  Terminal,
  Code2,
  Check,
  ArrowUpRight,
  Server,
  Layers,
  Zap,
  LayoutDashboard,
} from 'lucide-react';
import WorkCard from '@/components/cards/WorkCard';
import ProfileCard from '@/components/cards/ProfileCard';
import { getWorks, getProfiles, getCommunities, getZones } from '@/lib/data/service';

export default async function HomePage() {
  const works = await getWorks();
  const profiles = await getProfiles();
  const communities = await getCommunities();
  const zones = await getZones();

  return (
    <div className="flex flex-col w-full bg-[#08090d] text-white selection:bg-violet-500/30 selection:text-violet-200">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-white/[0.08]">
        {/* Subtle developer grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Ambient Glowing Spotlights */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Developer Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono font-medium text-zinc-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">AVAILABLE FOR PROJECTS & COLLAB</span>
              <span className="text-zinc-600">/</span>
              <span className="text-violet-300">CAMPUS PROOF-OF-WORK</span>
            </div>

            {/* High-Impact Display Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Where Real Student Engineering{' '}
              <span className="gradient-text-accent">
                Speaks Louder
              </span>{' '}
              Than Resumes.
            </h1>

            <p className="mt-6 text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl font-normal">
              The high-trust campus proof-of-work ecosystem. Discover real student engineering,
              collaborate across institutions in real-time WebRTC rooms, generate ATS-proof CVs,
              and get noticed by top engineering recruiters.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>Open General Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white text-black text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-zinc-200 active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4 text-black" />
                <span>Explore Showcase</span>
              </Link>

              <Link
                href="/cv/builder"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.05] text-white text-sm font-semibold border border-white/10 hover:border-white/20 hover:bg-white/[0.08] backdrop-blur-md active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Build ATS Resume</span>
              </Link>
            </div>

            {/* Live Infrastructure Metrics Ribbon */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">1,480+</p>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">Verified Works</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">48</p>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">Campuses Active</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.4%</p>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">Redis Cache Hit (&lt;5ms)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-400">23</p>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">PostgreSQL RLS Tables</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE SOFTWARE ENGINEER BENTO GRID ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer-Centric Platform</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-white">
                Engineered for High-Signal Builders
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                A verified architecture combining high-speed caching, real-time WebRTC, and ATS compiler tooling.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5">
            {/* Bento Tile 1: Interactive Terminal & Code Verification (Large 7 Cols) */}
            <div className="lg:col-span-7 bento-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      verification_engine.ts
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    TypeScript 5.0 • Strict
                  </span>
                </div>

                {/* Code Body */}
                <div className="bg-[#090b10] rounded-xl p-4 font-mono text-xs text-zinc-300 leading-relaxed border border-white/[0.05] overflow-x-auto">
                  <p className="text-zinc-500">// 1. Query verified proof-of-work with cache-aside</p>
                  <p>
                    <span className="text-violet-400">const</span> proof = <span className="text-cyan-400">await</span>{' '}
                    <span className="text-yellow-300">cacheGet</span>(
                    <span className="text-emerald-300">&quot;work:1480&quot;</span>,{' '}
                    <span className="text-cyan-400">async</span> () =&gt; &#123;
                  </p>
                  <p className="pl-4">
                    <span className="text-violet-400">return</span> supabase.<span className="text-blue-400">from</span>(
                    <span className="text-emerald-300">&apos;works&apos;</span>).<span className="text-blue-400">select</span>(
                    <span className="text-emerald-300">&apos;*, skills(*), owner(*)&apos;</span>);
                  </p>
                  <p>&#125;, <span className="text-amber-400">300</span>);</p>
                  <p className="text-zinc-500 mt-2">// 2. Real-time telemetry check</p>
                  <p className="text-emerald-400">
                    ✓ Cache hit in <span className="text-white font-bold">2.4ms</span> | RLS validation: <span className="text-white font-bold">Passed</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Instant Repos
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Peer Reviewed
                  </span>
                </div>
                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-white transition-colors"
                >
                  <span>Explore 1,480+ Projects</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Tile 2: Tech Stack Matrix (5 Cols) */}
            <div className="lg:col-span-5 bento-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Core Architecture
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Production-Grade</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">Modern Developer Stack</h3>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                  Engineered with the industry-standard developer toolchain for high throughput and zero cold-starts.
                </p>

                {/* Tech Badges Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span>Next.js 16 (Turbo)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>TypeScript 5</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Redis 7 Caching</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>PostgreSQL 15 RLS</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Docker &amp; NGINX</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>WebRTC Realtime</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px] text-zinc-400">Tailwind CSS v4 Engine</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  100% Type-Safe
                </span>
              </div>
            </div>

            {/* Bento Tile 3: Live WebRTC Collab Rooms (4 Cols) */}
            <div className="lg:col-span-4 bento-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Live Collaboration
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    14 Active Sprints
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">WebRTC Video &amp; Coding Rooms</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Pair program across campuses with encrypted P2P audio, HD video, and screen sharing. Zero installation required.
                </p>

                {/* Live Room Mockup Card */}
                <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span className="text-violet-300 font-semibold">room://ai-sprint-alpha</span>
                    <span className="text-[10px] text-zinc-400">4 Peers Connected</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">AR</div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white text-[9px] font-bold flex items-center justify-center">SK</div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white text-[9px] font-bold flex items-center justify-center">TN</div>
                    <span className="text-[10px] text-zinc-400 font-mono ml-1">+1 more</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <Link
                  href="/collaborate"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Launch Collab Sprint</span>
                </Link>
              </div>
            </div>

            {/* Bento Tile 4: ATS Resume & CV Studio (4 Cols) */}
            <div className="lg:col-span-4 bento-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    CV Studio &amp; ATS
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    98% Pass Rate
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">Automated ATS Optimization</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Format real engineering achievements into ATS-proof resumes with quantifiable metrics and verified project badges.
                </p>

                {/* Score Dial Preview */}
                <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Technical FAANG Template</p>
                    <p className="text-[11px] text-zinc-400 font-mono">Verified Works Attached</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 font-mono">98/100</span>
                    <p className="text-[10px] text-zinc-400 font-mono">Parser Score</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <Link
                  href="/cv/builder"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open CV Builder</span>
                </Link>
              </div>
            </div>

            {/* Bento Tile 5: AI Career Copilot (4 Cols) */}
            <div className="lg:col-span-4 bento-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Career Copilot
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                    Gemini Powered
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">Engineering Portfolio Optimizer</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Get automated feedback on code readability, README clarity, architecture diagrams, and recruiter visibility.
                </p>

                {/* AI Prompt Snippet */}
                <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-1.5 font-mono text-xs">
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-zinc-300">copilot: analyze-repo</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 pl-4 border-l border-purple-500/30">
                    &quot;Recommended: Add benchmark test showing Redis caching reduced response time by 84%.&quot;
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <Link
                  href="/copilot"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-semibold text-violet-200 transition-all shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Ask AI Copilot</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PEER PROOF-OF-WORK SHOWCASE SECTION ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Works Feed</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                Featured Student Engineering Projects
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Live GitHub repositories, full-stack systems, research papers, and algorithms cached in Redis.
              </p>
            </div>

            <Link
              href="/showcase"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-white transition-colors"
            >
              <span>Explore all 1,480+ projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.slice(0, 6).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TALENT & CAMPUS DIRECTORY ── */}
      <section className="py-20 md:py-28 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Talent Directory</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                Discover Verified Campus Builders
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Filter by university, innovation belt, or specific software skills.
              </p>
            </div>

            <Link
              href="/people"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors"
            >
              <span>Explore all peers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.slice(0, 4).map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Recruiter Fast-Track Callout Card */}
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#121422] to-[#0d0e17] border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 max-w-xl relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
                <ShieldCheck className="w-4 h-4" />
                <span>HIGH-SIGNAL RECRUITER PORTAL</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Recruit Candidates Backed By Verifiable Code.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Filter student engineers by verified repository commits, actual peer reviews, and ATS-standard resumes. No spam, just real engineering signal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
              <Link
                href="/recruiter/search"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>Launch Recruiter Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEDERATION CAMPUSES & ZONES ── */}
      <section className="py-20 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Federated Campus Innovation Network
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Connecting premier engineering colleges and regional tech corridors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="bento-card p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[11px] font-mono text-zinc-400 truncate">
                      {comm.domain}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{comm.name}</h4>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {comm.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <span className="text-zinc-400">Regional Zones:</span>
            {zones.map((zone) => (
              <span
                key={zone.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300"
              >
                <MapPin className="w-3 h-3 text-rose-400" />
                {zone.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
