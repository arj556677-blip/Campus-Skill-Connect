'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRole, UserRoleType, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  ArrowLeft,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { signInWithFirebaseGoogle, signInWithFirebaseGithub } from '@/lib/firebase/config';

// Official Brand Icons for Social Logins
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useRole();

  const redirectParam = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : null;

  // Unified form state
  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detect appropriate role from credentials or email domain
  const detectRoleFromEmail = (inputEmail: string): UserRoleType => {
    const lower = inputEmail.toLowerCase().trim();
    if (lower.includes('admin') || lower.startsWith('ad@')) {
      return 'admin';
    }
    if (lower.includes('recruiter') || lower.includes('@stripe') || lower.includes('@company') || lower.includes('@google.com')) {
      return 'recruiter';
    }
    return 'student';
  };

  // 1. Unified Email / Password Sign In
  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to continue.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const inferredRole = detectRoleFromEmail(email);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password || 'Campus@2026',
      });

      if (error) {
        console.warn('[SignIn] Supabase auth notice:', error.message);
        // Fallback demo/preview mode if Supabase URL is placeholder or offline or unconfirmed email
        const isPlaceholderMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        if (isPlaceholderMode || error.message.toLowerCase().includes('email not confirmed')) {
          login(inferredRole, redirectParam || undefined, {
            name: email.trim().split('@')[0],
            email: email.trim(),
          });
          return;
        }
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        login(inferredRole, redirectParam || undefined, {
          name: data.user.user_metadata?.display_name || email.trim().split('@')[0],
          email: data.user.email,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication service temporarily unavailable.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth (Firebase + Supabase Unified Support)
  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    setErrorMsg(null);

    try {
      const result = await signInWithFirebaseGoogle();
      if (result.error) {
        // Fallback to Supabase Google OAuth if configured
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) {
          setErrorMsg(result.error);
          return;
        }
      }

      // Successful OAuth verification
      login('student', redirectParam || undefined, {
        name: result.user?.displayName,
        email: result.user?.email,
        avatar: result.user?.photoURL,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setErrorMsg(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  // 3. GitHub OAuth (Firebase + Supabase Unified Support)
  const handleGithubSignIn = async () => {
    setSocialLoading('github');
    setErrorMsg(null);

    try {
      const result = await signInWithFirebaseGithub();
      if (result.error) {
        // Fallback to Supabase GitHub OAuth
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) {
          setErrorMsg(result.error);
          return;
        }
      }

      // Successful OAuth verification
      if (result.githubUsername && typeof window !== 'undefined') {
        localStorage.setItem('csc_github_username', result.githubUsername);
      }
      const resolvedGithubName =
        result.user?.displayName ||
        (result.githubUsername ? `@${result.githubUsername}` : undefined) ||
        result.user?.email?.split('@')[0] ||
        'Octocat Builder';

      login('student', redirectParam || undefined, {
        name: resolvedGithubName,
        email: result.user?.email || `${result.githubUsername || 'student'}@github.campus.edu`,
        avatar: result.user?.photoURL || undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'GitHub authentication failed';
      setErrorMsg(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  // 4. Quick Persona Fill (Evaluator & Demo Support)
  const handleQuickDemo = (role: UserRoleType) => {
    const persona = ROLE_PERSONAS[role];
    setEmail(persona.email);
    setPassword('••••••••••••');
    setErrorMsg(null);
    login(role, redirectParam || undefined);
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-[#f8fafc] text-slate-900">
      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400">
            Unified Auth • V2.0
          </span>
        </div>

        {/* Guest Pass-through Banner for CV / Public Tools */}
        {redirectParam && (redirectParam.startsWith('/cv') || redirectParam === '/cv') && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5 text-blue-900">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
                📄
              </span>
              <div>
                <p className="font-bold text-slate-900">Looking for the CV Builder?</p>
                <p className="text-[11px] text-slate-600">
                  Guest access is open! You do not need to sign in to build or export your ATS resume.
                </p>
              </div>
            </div>
            <Link
              href="/cv/builder"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shrink-0 shadow-xs"
            >
              <span>Open CV Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── UNIFIED SIGN IN CARD ── */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
              CS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Campus Skill Connect
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Unified gateway for verified student builders, tech talent partners, and institution administrators.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={socialLoading !== null || loading}
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <GoogleIcon />
              <span>
                {socialLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={socialLoading !== null || loading}
              className="w-full py-2.5 px-4 rounded-full bg-[#24292f] hover:bg-[#1b1f23] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <GithubIcon />
              <span>
                {socialLoading === 'github' ? 'Connecting to GitHub...' : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              or continue with email
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Unified Email & Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Institutional or Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu or name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password / Passkey
                </label>
                <Link
                  href="/auth/reset-password"
                  className="text-xs text-[#1b59f8] hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password or passkey"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full py-3.5 px-4 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
              1-Click Instant Demo Testing
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-2 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-all border border-slate-200 shadow-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="py-2 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-all border border-slate-200 shadow-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span>Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-all border border-slate-200 shadow-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <Zap className="w-3 h-3 text-rose-600 fill-rose-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Footer links */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              New to Campus Skill Connect?{' '}
              <Link href="/sign-up" className="font-bold text-[#1b59f8] hover:underline">
                Create Verified Account
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              Encrypted institutional authentication &amp; university privacy compliance (DPDP Act 2023).
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
        <div className="min-h-[calc(100vh-65px)] bg-[#f8fafc] flex items-center justify-center">
          <div className="text-xs font-medium text-slate-500 animate-pulse">
            Loading unified authentication portal...
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
