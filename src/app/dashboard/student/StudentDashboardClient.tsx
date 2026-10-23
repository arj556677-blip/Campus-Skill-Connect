'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  FileText,
  ExternalLink,
  Plus,
  Video,
  Eye,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Work, Profile } from '@/lib/types';

interface StudentDashboardClientProps {
  myWorks: Work[];
  profiles: Profile[];
}

export default function StudentDashboardClient({
  myWorks: initialWorks,
}: { myWorks: Work[]; profiles?: Profile[] }) {
  const { currentUser: authUser } = useRole();
  const currentUser = authUser || ROLE_PERSONAS.student;
  const works = initialWorks;

  return (
    <div className="space-y-8">
      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-[#10121a]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-violet-600/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Verified Student Builder
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  @iisc.ac.in • IISc Bangalore
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="mt-1 text-xs text-zinc-400 max-w-xl">
                Your proof of work is verified across campus. 3 Tier-1 recruiters inspected your repositories this week.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/works/new"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Proof</span>
            </Link>

            <Link
              href="/cv"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>ATS CV Studio</span>
            </Link>

            <Link
              href="/collaborate"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Live Sprint Rooms</span>
            </Link>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Portfolio Status</p>
              <p className="text-xs font-bold text-white">Live & Recruiter-Discoverable</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Campus Network</p>
              <p className="text-xs font-bold text-white">IISc Bangalore Federated</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Profile Views</p>
              <p className="text-xs font-bold text-white">34 Views (+28% this week)</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase">Active Inquiries</p>
              <p className="text-xs font-bold text-white">2 Recruiter Chats Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 1: ATS GAUGE & RECRUITER RADAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TILE 1: ATS SCORE GAUGE */}
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Checklist Status</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                CHECKLIST PASSING
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Standard Section Headings</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Present</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Contact Information &amp; Links</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Validated</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Date Format Consistency</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Standard</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Campus Works Attached</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Linked</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-400 leading-relaxed font-sans">
              Rule-based checks confirm your resume uses standard headings and single-column formatting without unverified score assumptions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <Link
              href="/cv"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>Tune with AI in CV Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-[11px] font-mono text-zinc-500">
              Updated 2 days ago
            </span>
          </div>
        </div>

        {/* TILE 2: RECRUITER VIEWS & INQUIRIES (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Recruiter Inquiries & Portfolio Activity
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                +28% Recruiter Engagement
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Recruiter Card 1 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        MC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Marcus Chen</p>
                        <p className="text-[10px] text-zinc-400">Senior Talent Partner @ Stripe</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      INQUIRY
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-300 italic">
                    &ldquo;Saw your Redis architecture and benchmark graphs. We&apos;re hiring for Distributed Systems New Grads. Would love to connect!&rdquo;
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">2 hours ago</span>
                  <Link
                    href="/messages"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Reply in Messages</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Recruiter Card 2 */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        SC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Sarah Chen</p>
                        <p className="text-[10px] text-zinc-400">Engineering Lead @ Google Cloud</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                      PROFILE VIEW
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-300">
                    Inspected your WebRTC low-latency audio transmission project and verified your GitHub repository commits.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">Yesterday</span>
                  <Link
                    href="/people"
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Scout Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
            <span>Recent searches matching your profile: <strong className="text-white">Redis, Next.js 16, Distributed Systems, WebRTC</strong></span>
            <Link href="/recruiter/search" className="text-violet-400 hover:underline shrink-0">
              See what recruiters see &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 2: YOUR PUBLISHED PROOFS OF WORK ── */}
      <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Your Published Proofs of Work ({works.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Production code repositories and technical papers backed by cryptographically signed proofs
            </p>
          </div>

          <Link
            href="/works/new"
            className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-500/30 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Work</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work) => (
            <div
              key={work.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-violet-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                    {work.category}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <Eye className="w-3 h-3 text-zinc-500" />
                    <span>{work.views_count || 120}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                  {work.title}
                </h3>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {work.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Repo</span>
                </div>

                <Link
                  href={`/works/${work.id}`}
                  className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENTO TILES ROW 3: REAL-TIME COLLAB & HACKATHONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLLAB SPRINT ROOMS */}
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live Campus Collab Sprints
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WebRTC SFU Active
              </span>
            </div>

            <p className="mt-3 text-xs text-zinc-400">
              Join interactive, zero-latency pair programming rooms with verified peers from your campus.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Distributed Consensus (Raft in Rust)</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">3 Builders inside • Audio & Screen sharing</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all"
                >
                  Join Room
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Turbopack & Next.js 16 Internal Sprint</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">2 Builders inside • Code editor active</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all"
                >
                  Join Room
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08]">
            <Link
              href="/collaborate"
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Collab Sprint Room</span>
            </Link>
          </div>
        </div>

        {/* HACKATHON & FELLOWSHIP OPPORTUNITIES */}
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Recommended High-Signal Challenges
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">Tier-1 Sponsored</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    $25,000 BOUNTY
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">Global Edge Systems Hackathon</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Build low-latency caching and distributed sync solutions. Winners get direct interviews at Stripe & Cloudflare.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 shrink-0 mt-1">
                  Apply
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    RESEARCH GRANT
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">IISc Deeptech Demo Day 2026</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Present student proof-of-work before leading venture partners and tech founders.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 shrink-0 mt-1">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
            <span>Matched to your skills: <strong>Redis, Next.js, Rust</strong></span>
            <Link href="/showcase" className="text-violet-400 hover:underline">
              Explore All Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
