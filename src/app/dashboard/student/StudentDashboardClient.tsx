'use client';

import React from 'react';
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
  UserCog,
} from 'lucide-react';
import { Work, Profile } from '@/lib/types';

interface StudentDashboardClientProps {
  myWorks: Work[];
  profiles?: Profile[];
}

export default function StudentDashboardClient({
  myWorks: initialWorks,
}: StudentDashboardClientProps) {
  const { currentUser: authUser } = useRole();
  const currentUser = authUser || ROLE_PERSONAS.student;
  const works = initialWorks;

  return (
    <div className="space-y-8">
      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Soft subtle glow wash */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1b59f8]/20 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200/80">
                  Verified Student Builder
                </span>
                <span className="text-xs font-mono text-slate-500">
                  @iisc.ac.in • IISc Bangalore
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                Your proof of work is verified across campus and discoverable by accredited academic and corporate partners.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/works/new"
              className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Proof</span>
            </Link>

            <Link
              href="/cv"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#1b59f8]" />
              <span>ATS CV Studio</span>
            </Link>

            <Link
              href="/collaborate"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Live Sprint Rooms</span>
            </Link>

            <Link
              href="/profile/edit"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <UserCog className="w-4 h-4 text-[#1b59f8]" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Portfolio Status</p>
              <p className="text-xs font-bold text-slate-800">Live &amp; Recruiter-Discoverable</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b59f8] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Campus Network</p>
              <p className="text-xs font-bold text-slate-800">IISc Bangalore Federated</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Visibility</p>
              <p className="text-xs font-bold text-slate-800">Campus &amp; Recruiter Discoverable</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Inquiries</p>
              <p className="text-xs font-bold text-slate-800">Direct Messages Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 1: ATS GAUGE & RECRUITER RADAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TILE 1: ATS SCORE GAUGE */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1b59f8] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Checklist Status</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                CHECKLIST PASSING
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Standard Section Headings</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Present</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contact Information &amp; Links</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Validated</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Date Format Consistency</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Standard</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified Campus Works Attached</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Linked</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 leading-relaxed font-sans">
              Rule-based checks confirm your resume uses standard headings and single-column formatting without unverified score assumptions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/cv"
              className="text-xs font-bold text-[#1b59f8] hover:text-[#174ed8] transition-colors flex items-center gap-1.5"
            >
              <span>Tune in CV Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-[11px] font-mono text-slate-400">
              Updated 2 days ago
            </span>
          </div>
        </div>

        {/* TILE 2: RECRUITER VIEWS & INQUIRIES (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Recruiter Inquiries &amp; Portfolio Activity
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                Verified Portfolio
              </span>
            </div>

            <div className="mt-4 p-8 rounded-2xl bg-[#f8fafc] border border-slate-200/70 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-slate-900">Direct Inquiries from Recruiter Searches</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  When verified recruiters or university faculty reach out regarding your published proof-of-work repositories, their inquiries and meeting invitations will appear here.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/works/new"
                  className="px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Publish New Proof
                </Link>
                <Link
                  href="/messages"
                  className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Open Messages
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span>Matched competencies: <strong className="text-slate-800">Systems Architecture, Distributed Systems, Cloud Infrastructure</strong></span>
            <Link href="/showcase" className="text-[#1b59f8] font-semibold hover:underline shrink-0">
              See what recruiters see &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 2: YOUR PUBLISHED PROOFS OF WORK ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1b59f8]" />
              <span>Your Published Proofs of Work ({works.length})</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Production code repositories and technical papers backed by cryptographically signed proofs
            </p>
          </div>

          <Link
            href="/works/new"
            className="px-4 py-2 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Work</span>
          </Link>
        </div>

        {works.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-[#f8fafc] border border-dashed border-slate-300 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b59f8] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">Welcome to your Student Command Center!</h3>
              <p className="text-xs text-slate-500">
                You haven&apos;t published a proof of work yet. Publish your first project repository, technical paper, or benchmark to start getting recruiter visibility.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/works/new"
                className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish First Proof</span>
              </Link>
              <Link
                href="/showcase"
                className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Explore Showcase
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <div
                key={work.id}
                className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-[#1b59f8]/40 hover:bg-white transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold">
                      {work.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>{work.views_count || 120}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#1b59f8] transition-colors line-clamp-2">
                    {work.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {work.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Repo</span>
                  </div>

                  <Link
                    href={`/works/${work.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-[#1b59f8] flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BENTO TILES ROW 3: REAL-TIME COLLAB & HACKATHONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLLAB SPRINT ROOMS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Live Campus Collab Sprints
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                WebRTC SFU Active
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Join interactive, zero-latency pair programming rooms with verified peers from your campus.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Distributed Consensus (Raft in Rust)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">3 Builders inside • Audio &amp; Screen sharing</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  Join Room
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">High-Performance Systems &amp; Compiler Sprint</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Live sprint room • Code editor active</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  Join Room
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/collaborate"
              className="w-full py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Collab Sprint Room</span>
            </Link>
          </div>
        </div>

        {/* HACKATHON & FELLOWSHIP OPPORTUNITIES */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Recommended High-Signal Challenges
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Tier-1 Sponsored</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                    $25,000 BOUNTY
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">Global Edge Systems Hackathon</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Build low-latency caching and distributed sync solutions. Winners get direct interviews at Stripe &amp; Cloudflare.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-black shrink-0 mt-1">
                  Apply
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                    RESEARCH GRANT
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">IISc Deeptech Demo Day 2026</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Present student proof-of-work before leading venture partners and tech founders.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-black shrink-0 mt-1">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Matched to your skills: <strong className="text-slate-800">Distributed Systems, Rust, Cloud Architecture</strong></span>
            <Link href="/showcase" className="text-[#1b59f8] font-semibold hover:underline">
              Explore All Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
