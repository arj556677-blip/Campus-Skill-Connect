'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import {
  LayoutDashboard,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  Video,
  FileText,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Activity,
  ShieldCheck,
  ExternalLink,
  Code2,
  LogIn,
  UserCheck,
} from 'lucide-react';
import { Work, Community, Profile } from '@/lib/types';

interface GeneralDashboardClientProps {
  works: Work[];
  communities: Community[];
  profiles: Profile[];
}

export default function GeneralDashboardClient({
  works,
  communities,
  profiles,
}: GeneralDashboardClientProps) {
  const { isLoggedIn, isMounted, currentRole, currentUser } = useRole();

  return (
    <div className="space-y-10">
      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-[#10121a]/90 border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>
                {isMounted && isLoggedIn && currentUser
                  ? `Active Workspace: ${currentUser.roleLabel}`
                  : 'Public Campus Overview • Non-Logged Dashboard'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              General Operations & Campus Hub
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Explore the entire campus network ecosystem. Select a specialized dashboard below to access role-specific workflows for administrators, student builders, or enterprise recruiters.
            </p>
          </div>

          {/* Quick Login / Role Switcher Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isMounted && isLoggedIn && currentUser ? (
              <Link
                href={currentUser.dashboardUrl}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to My {currentUser.roleLabel} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Customized Role Logins</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/showcase"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Browse All Works</span>
            </Link>
          </div>
        </div>

        {/* Public Guest Guidance Banner (When NOT Logged In) */}
        {isMounted && !isLoggedIn && (
          <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-zinc-300">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <span>
                You are viewing the <strong>Non-Logged General Dashboard</strong>. Select any role below to view its customized sign-in portal.
              </span>
            </div>
            <Link
              href="/sign-in"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold shrink-0 text-center transition-all flex items-center gap-1.5 justify-center"
            >
              <LogIn className="w-3.5 h-3.5 text-violet-400" />
              <span>Choose Role Login</span>
            </Link>
          </div>
        )}

        {/* Platform-wide Quick Stats */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">4,820+</p>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">Verified Student Builders</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{communities.length} Campuses</p>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">Federated Universities</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">142</p>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">Enterprise Tech Recruiters</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-violet-400">99.4%</p>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">Proof-of-Skill Authenticity</p>
          </div>
        </div>
      </div>

      {/* ── THE 3 SPECIALIZED DASHBOARDS (CORE GATEWAYS) ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>Specialized Role Dashboards</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any role view to access tailored features and dashboards
            </p>
          </div>
          {isMounted && isLoggedIn && currentUser ? (
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              Logged in as: <strong className="text-white uppercase">{currentUser.name} ({currentUser.badge})</strong>
            </span>
          ) : (
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
              Status: <strong className="text-zinc-400">GUEST (NOT LOGGED IN)</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GATEWAY 1: ADMIN DASHBOARD */}
          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 hover:border-rose-500/40 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 group shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase tracking-wider">
                  Superadmin Console
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-rose-300 transition-colors">
                Admin & Operations Dashboard (Me)
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Full root governance over the campus network. Review plagiarism flags in the moderation queue, whitelist university domains, inspect PostgreSQL RLS policies, and monitor Redis cache telemetry.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Plagiarism & Moderation Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Academic Domain Whitelisting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cryptographic Audit Trail Stream</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2">
              {isMounted && isLoggedIn && currentRole === 'admin' ? (
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Your Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=admin"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In as Admin (Me)</span>
                  </Link>
                  <Link
                    href="/admin"
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all text-center"
                    title="View Admin Dashboard Preview"
                  >
                    Preview
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* GATEWAY 2: STUDENT DASHBOARD */}
          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 hover:border-violet-500/40 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 group shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-300 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-violet-400" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase tracking-wider">
                  Builder Hub
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-violet-300 transition-colors">
                Student Builder Command Center
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Empower your career through verified proof of work. Inspect your 98% ATS resume compatibility gauge, track incoming recruiter profile views from Stripe and Google, and launch live pair-programming sprints.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Live 98% ATS Resume Readiness Gauge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Recruiter Profile Views & Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>WebRTC Pair-Programming Sprints</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2">
              {isMounted && isLoggedIn && currentRole === 'student' ? (
                <Link
                  href="/dashboard/student"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Your Student Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=student"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In as Student</span>
                  </Link>
                  <Link
                    href="/dashboard/student"
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all text-center"
                    title="View Student Dashboard Preview"
                  >
                    Preview
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* GATEWAY 3: RECRUITER DASHBOARD */}
          <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 group shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Talent Partner
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
                Recruiter Talent Sourcing Hub
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Skip unverified resumes and discover high-signal student engineers. Inspect authentic GitHub commits, track candidates through a 4-stage talent pipeline, and send direct interview invitations.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Candidate Pipeline Funnel (48 Sourced)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Candidate Match Radar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Outreach & Interview Scheduler</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2">
              {isMounted && isLoggedIn && currentRole === 'recruiter' ? (
                <Link
                  href="/dashboard/recruiter"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Your Recruiter Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=recruiter"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In as Recruiter</span>
                  </Link>
                  <Link
                    href="/dashboard/recruiter"
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all text-center"
                    title="View Recruiter Dashboard Preview"
                  >
                    Preview
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PLATFORM PULSE: RECENT WORKS & CAMPUS FEDERATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT VERIFIED PROOFS */}
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
              <Code2 className="w-4 h-4 text-violet-400" />
              <span>Trending Proofs of Work</span>
            </h3>
            <Link href="/showcase" className="text-xs text-violet-400 hover:underline">
              View All ({works.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {works.slice(0, 3).map((work) => (
              <div
                key={work.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                      {work.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{work.title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{work.description}</p>
                </div>

                <Link
                  href={`/works/${work.id}`}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold shrink-0 transition-all"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPUS PARTNER FEDERATIONS */}
        <div className="rounded-3xl bg-[#10121a]/80 border border-white/10 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Federated Universities</span>
            </h3>
            <Link href="/showcase" className="text-xs text-cyan-400 hover:underline">
              Explore Campuses &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={comm.logo_url || ''}
                    alt={comm.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{comm.name}</h4>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">*.{comm.domain}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
