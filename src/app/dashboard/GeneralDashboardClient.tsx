'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import {
  LayoutDashboard,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
  Code2,
  LogIn,
} from 'lucide-react';
import { Work, Community, Profile } from '@/lib/types';
import DashboardSessionGuard from '@/components/auth/DashboardSessionGuard';

interface GeneralDashboardClientProps {
  works: Work[];
  communities: Community[];
  profiles: Profile[];
}

export default function GeneralDashboardClient({
  works,
  communities,
}: GeneralDashboardClientProps) {
  const { isLoggedIn, isMounted, currentRole, currentUser } = useRole();

  // If already logged in, automatically navigate to the user's role-specific dashboard
  useEffect(() => {
    if (isMounted && isLoggedIn && currentUser?.dashboardUrl) {
      window.location.replace(currentUser.dashboardUrl);
    }
  }, [isMounted, isLoggedIn, currentUser]);

  return (
    <div className="space-y-10">
      {/* Session Security Guard: Disables browser back/previous button on authenticated dashboard */}
      <DashboardSessionGuard />

      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Soft subtle glow wash */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1b59f8] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>
                {isMounted && isLoggedIn && currentUser
                  ? `Active Workspace: ${currentUser.roleLabel}`
                  : 'Public Campus Overview • Non-Logged Dashboard'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              General Operations &amp; Campus Hub
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore the entire campus network ecosystem. Select a specialized dashboard below to access role-specific workflows for administrators, student builders, or enterprise recruiters.
            </p>
          </div>

          {/* Quick Login / Role Switcher Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isMounted && isLoggedIn && currentUser ? (
              <Link
                href={currentUser.dashboardUrl}
                className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to My {currentUser.roleLabel} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Customized Role Logins</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/showcase"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Browse All Works</span>
            </Link>
          </div>
        </div>

        {/* Public Guest Guidance Banner (ONLY When NOT Logged In) */}
        {isMounted && !isLoggedIn && (
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <Sparkles className="w-4 h-4 text-[#1b59f8] shrink-0" />
              <span>
                You are viewing the <strong>Non-Logged General Dashboard</strong>. Select any role below to view its customized sign-in portal.
              </span>
            </div>
            <Link
              href="/sign-in"
              className="px-4 py-1.5 rounded-full bg-[#0f172a] hover:bg-black text-white font-bold shrink-0 text-center transition-all flex items-center gap-1.5 justify-center"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Choose Role Login</span>
            </Link>
          </div>
        )}

        {/* Platform-wide Quick Stats */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono">
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">Student Profiles</p>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Verified Academic Network</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#1b59f8]">{communities.length} Campuses</p>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Federated Universities</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">Corporate Access</p>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Screened Tech Recruiters</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-indigo-700">Data Isolation</p>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Strict Tenant Security</p>
          </div>
        </div>
      </div>

      {/* ── THE 3 SPECIALIZED DASHBOARDS (CORE GATEWAYS) ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1b59f8]" />
              <span>Specialized Role Dashboards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any role view to access tailored features and dashboards
            </p>
          </div>
          {isMounted && isLoggedIn && currentUser ? (
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              Logged in as: <strong className="text-slate-800 uppercase">{currentUser.name} ({currentUser.badge})</strong>
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Status: <strong className="text-slate-600">GUEST (NOT LOGGED IN)</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GATEWAY 1: ADMIN DASHBOARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 hover:border-rose-400 p-6 sm:p-7 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase tracking-wider">
                  Superadmin Console
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-rose-600 transition-colors">
                Admin &amp; Operations Dashboard
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Full root governance over the campus network. Review plagiarism flags in the moderation queue, whitelist university domains, inspect access security policies, and monitor real-time network telemetry.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Plagiarism &amp; Moderation Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Academic Domain Whitelisting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cryptographic Audit Trail Stream</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              {isLoggedIn && currentRole === 'admin' ? (
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Open Your Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : isLoggedIn ? (
                <span className="w-full py-2.5 px-4 rounded-full bg-slate-50 text-slate-400 border border-slate-200/60 text-xs font-medium text-center">
                  Requires Admin Account
                </span>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=admin"
                    className="flex-1 py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In as Admin</span>
                  </Link>
                  <Link
                    href="/admin"
                    className="py-2.5 px-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all text-center shadow-xs"
                    title="View Admin Dashboard Preview"
                  >
                    Preview
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* GATEWAY 2: STUDENT DASHBOARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 p-6 sm:p-7 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#1b59f8] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold uppercase tracking-wider">
                  Builder Hub
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-[#1b59f8] transition-colors">
                Student Builder &amp; Faculty Command Center
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Empower your career and research through verified proof of work. Build with rule-based ATS resume validation, publish research artifacts, inspect views, and launch collaboration sprint rooms.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b59f8]" />
                  <span>Rule-Based ATS Resume &amp; Research Checklist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b59f8]" />
                  <span>Recruiter Profile Views &amp; Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1b59f8]" />
                  <span>WebRTC Pair-Programming &amp; Mentorship Sprints</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              {isMounted && isLoggedIn && (currentRole === 'student' || currentRole === 'faculty') ? (
                <Link
                  href="/dashboard/student"
                  className="w-full py-2.5 px-4 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Open Your {currentRole === 'faculty' ? 'Faculty Workspace' : 'Student Hub'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : isLoggedIn ? (
                <span className="w-full py-2.5 px-4 rounded-full bg-slate-50 text-slate-400 border border-slate-200/60 text-xs font-medium text-center">
                  Requires Student or Faculty Account
                </span>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=student"
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In to Campus</span>
                  </Link>
                  <Link
                    href="/dashboard/student"
                    className="py-2.5 px-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all text-center shadow-xs"
                    title="View Student Dashboard Preview"
                  >
                    Preview
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* GATEWAY 3: RECRUITER DASHBOARD */}
          <div className="rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 p-6 sm:p-7 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider">
                  Talent Partner
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
                Recruiter Talent Sourcing Hub
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Skip unverified resumes and discover high-signal student engineers. Inspect authentic GitHub commits, track candidates through a 4-stage talent pipeline, and send direct interview invitations.
              </p>

              <div className="mt-5 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Candidate Pipeline Funnel (48 Sourced)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Candidate Match Radar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Outreach &amp; Scheduler</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              {isLoggedIn && currentRole === 'recruiter' ? (
                <Link
                  href="/dashboard/recruiter"
                  className="w-full py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Open Your Recruiter Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : isLoggedIn ? (
                <span className="w-full py-2.5 px-4 rounded-full bg-slate-50 text-slate-400 border border-slate-200/60 text-xs font-medium text-center">
                  Requires Recruiter Account
                </span>
              ) : (
                <>
                  <Link
                    href="/sign-in?role=recruiter"
                    className="flex-1 py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In as Recruiter</span>
                  </Link>
                  <Link
                    href="/dashboard/recruiter"
                    className="py-2.5 px-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all text-center shadow-xs"
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
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono uppercase">
              <Code2 className="w-4 h-4 text-[#1b59f8]" />
              <span>Trending Proofs of Work</span>
            </h3>
            <Link href="/showcase" className="text-xs text-[#1b59f8] hover:underline font-semibold">
              View All ({works.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {works.slice(0, 3).map((work) => (
              <div
                key={work.id}
                className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-blue-300 transition-all flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold">
                      {work.category}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{work.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{work.description}</p>
                </div>

                <Link
                  href={`/works/${work.id}`}
                  className="px-4 py-1.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-semibold shrink-0 transition-all shadow-xs"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPUS PARTNER FEDERATIONS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono uppercase">
              <Building className="w-4 h-4 text-[#1b59f8]" />
              <span>Federated Universities</span>
            </h3>
            <Link href="/showcase" className="text-xs text-[#1b59f8] hover:underline font-semibold">
              Explore Campuses &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={comm.logo_url || ''}
                    alt={comm.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{comm.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500 truncate">*.{comm.domain}</p>
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
