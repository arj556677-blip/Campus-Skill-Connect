'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRole, UserRoleType, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  ArrowLeft,
  Mail,
  Lock,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Check,
  Zap,
  CheckCircle2,
  KeyRound,
  Building,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useRole();

  const roleParam = searchParams.get('role') as UserRoleType;
  const initialRole: UserRoleType = roleParam && ROLE_PERSONAS[roleParam] ? roleParam : 'student';

  const [selectedRole, setSelectedRole] = useState<UserRoleType>(initialRole);
  const [email, setEmail] = useState(ROLE_PERSONAS[initialRole].email);
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  // Sync role defaults when tab switches
  const handleRoleSelect = (role: UserRoleType) => {
    setSelectedRole(role);
    setEmail(ROLE_PERSONAS[role].email);
    setPassword('••••••••••••');
    setErrorMsg(null);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const redirectParam = searchParams.get('redirect') || undefined;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password === '••••••••••••' ? 'Campus@2026' : password,
      });

      if (error) {
        // If live Supabase returns error, display clean error message
        console.warn('[SignIn] Supabase auth error:', error.message);
        // If in local mock preview mode with demo credentials, log them in via role context
        const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        if (isPlaceholderMode) {
          login(selectedRole, redirectParam);
          return;
        }
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        login(selectedRole, redirectParam);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication service temporarily unavailable.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = () => {
    setMagicSent(true);
    setTimeout(() => setMagicSent(false), 4000);
  };

  const activePersona = ROLE_PERSONAS[selectedRole];
  const redirectParam = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : null;

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#08090d]">
      {/* Dynamic Ambient Background Glows tailored to selected role */}
      {selectedRole === 'admin' ? (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none transition-all duration-500" />
      ) : selectedRole === 'student' ? (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none transition-all duration-500" />
      ) : (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none transition-all duration-500" />
      )}

      <div className="max-w-2xl w-full space-y-6 relative z-10">
        {/* Navigation breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to General Dashboard</span>
          </Link>

          <span className="text-[11px] font-mono text-zinc-500">
            Role-Based Gateway • v2.0
          </span>
        </div>

        {/* Guest Pass-through Banner for CV / Public Tools */}
        {redirectParam && (redirectParam.startsWith('/cv') || redirectParam === '/cv') && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-[0_0_25px_rgba(6,182,212,0.15)] animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 text-cyan-200">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                📄
              </span>
              <div>
                <p className="font-bold text-white">Looking for the CV Builder?</p>
                <p className="text-[11px] text-cyan-300/80">
                  Guest access is open! You do not need to sign in to build or export your ATS resume.
                </p>
              </div>
            </div>
            <Link
              href="/cv/builder"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all shrink-0 shadow-sm"
            >
              <span>Open CV Builder Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── 3 CUSTOMIZED LOGIN VIEW SELECTOR CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Admin */}
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`p-3.5 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden ${
              selectedRole === 'admin'
                ? 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/40'
                : 'bg-[#10121a]/80 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                SUPERADMIN
              </span>
            </div>
            <p className="text-xs font-bold text-white">Admin (Me) Login</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Root operations & moderation</p>
          </button>

          {/* Card 2: Student */}
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`p-3.5 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden ${
              selectedRole === 'student'
                ? 'bg-violet-500/15 border-violet-500/50 shadow-[0_0_25px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/40'
                : 'bg-[#10121a]/80 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                STUDENT
              </span>
            </div>
            <p className="text-xs font-bold text-white">Student Builder Login</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">ATS resumes & proof of work</p>
          </button>

          {/* Card 3: Recruiter */}
          <button
            type="button"
            onClick={() => handleRoleSelect('recruiter')}
            className={`p-3.5 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden ${
              selectedRole === 'recruiter'
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/40'
                : 'bg-[#10121a]/80 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                RECRUITER
              </span>
            </div>
            <p className="text-xs font-bold text-white">Tech Recruiter Login</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Pipeline & candidate radar</p>
          </button>
        </div>

        {/* ── CUSTOMIZED LOGIN VIEW CARD ── */}
        <div
          className={`rounded-3xl bg-[#10121a]/95 border p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-6 transition-all duration-300 ${
            selectedRole === 'admin'
              ? 'border-rose-500/30'
              : selectedRole === 'student'
              ? 'border-violet-500/30'
              : 'border-emerald-500/30'
          }`}
        >
          {/* Customized View Header */}
          <div className="text-center space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                selectedRole === 'admin'
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  : selectedRole === 'student'
                  ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {selectedRole === 'admin' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : selectedRole === 'student' ? (
                <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>
                {selectedRole === 'admin'
                  ? 'Superadmin Root Security Portal'
                  : selectedRole === 'student'
                  ? 'Student Builder Command Login'
                  : 'Enterprise Recruiter Talent Portal'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedRole === 'admin'
                ? 'Sign In as Administrator (Me)'
                : selectedRole === 'student'
                ? 'Sign In to Your Student Campus'
                : 'Sign In to Recruiter Sourcing Hub'}
            </h1>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              {selectedRole === 'admin'
                ? 'Authenticates root access to PostgreSQL RLS policies, moderation queue, and system telemetry.'
                : selectedRole === 'student'
                ? 'Access your proof of work repositories, rule-based ATS resume studio, and real-time sprint rooms.'
                : 'Source pre-verified students, inspect authenticated GitHub commits, and manage candidate shortlists.'}
            </p>
          </div>

          {/* Active Persona Profile Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {activePersona.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase border ${
                      selectedRole === 'admin'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : selectedRole === 'student'
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {activePersona.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {activePersona.title}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[10px] font-mono text-zinc-500 block">Landing At</span>
              <span className="text-xs font-mono font-bold text-violet-300">
                {redirectParam || activePersona.dashboardUrl}
              </span>
            </div>
          </div>

          {/* Role Access Capability Bullets */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
            {selectedRole === 'admin' ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>PostgreSQL 15 Strict RLS Policies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Plagiarism & Anti-Scraping Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Academic Domain Whitelist (.ac.in)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>SHA-256 Tamper-Proof Audit Trail</span>
                </div>
              </>
            ) : selectedRole === 'student' ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Rule-Based Single-Column Resume Tuner</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Verified GitHub Commit Badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Incoming Recruiter View Radar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Live WebRTC Peer Sprint Rooms</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Candidate Search Radar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Authentic Code Commit Inspector</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>4-Stage Hiring Pipeline Funnel</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Candidate Outreach Drawer</span>
                </div>
              </>
            )}
          </div>

          {/* 1-Click Instant Demo Login CTA */}
          <button
            type="button"
            onClick={() => handleSignIn()}
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
              selectedRole === 'admin'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600'
                : selectedRole === 'student'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-500'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>
              {loading
                ? `Signing into ${activePersona.roleLabel}...`
                : `Instant Demo Log In as ${activePersona.roleLabel}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#10121a] px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0">
              or authenticate with credentials
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Customized Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono">
                {selectedRole === 'admin'
                  ? 'Superadmin Root Email'
                  : selectedRole === 'student'
                  ? 'Institutional Email (.edu or .ac.in)'
                  : 'Company Work Email (@stripe.com)'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                  {selectedRole === 'admin'
                    ? 'Root Passkey / Security Key'
                    : 'Password / Passkey'}
                </label>
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/reset-password"
                    className="text-xs text-[var(--accent)] hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : `Sign In with ${selectedRole === 'admin' ? 'Passkey' : 'Password'}`}</span>
            </button>
          </form>

          {/* Footer links */}
          <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
            <p className="text-xs text-zinc-400">
              New to Campus Skill Connect?{' '}
              <Link href="/sign-up" className="font-bold text-violet-400 hover:underline">
                Create Verified Account
              </Link>
            </p>
            <p className="text-[11px] text-zinc-500">
              Zero-Trust authentication powered by Supabase & Redis cache-aside invalidation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-65px)] bg-[#08090d] flex items-center justify-center">
          <div className="text-xs font-mono text-violet-400 animate-pulse">
            Loading authentication portal...
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
