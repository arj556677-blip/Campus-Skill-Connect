'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRole } from '@/lib/auth/role-context';
import { ArrowLeft, Mail, Lock, User, Building, ArrowRight, GraduationCap, Briefcase, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { MOCK_COMMUNITIES } from '@/lib/data/mock-data';
import { signInWithFirebaseGoogle, signInWithFirebaseGithub } from '@/lib/firebase/config';

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

export default function SignUpPage() {
  const { login } = useRole();

  const [accountType, setAccountType] = useState<'student' | 'recruiter'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [communityId, setCommunityId] = useState(MOCK_COMMUNITIES[0].id);
  const [companyName, setCompanyName] = useState('Stripe');
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and re-enter your password.');
      return;
    }

    if (!consentGiven) {
      setErrorMsg('You must review and consent to data processing under the DPDP Act 2023 to proceed.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name,
            institution_id: accountType === 'student' ? communityId : null,
            company_name: accountType === 'recruiter' ? companyName : null,
            role: accountType,
          },
        },
      });

      if (error) {
        const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        if (isPlaceholder) {
          login(accountType, undefined, {
            name: name.trim() || email.trim().split('@')[0],
            email: email.trim(),
          });
          return;
        }
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Automatically sign in the user to their new account and go directly to their dashboard
      login(accountType, undefined, {
        name: name.trim() || email.trim().split('@')[0],
        email: email.trim(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    setErrorMsg(null);
    try {
      const res = provider === 'google' ? await signInWithFirebaseGoogle() : await signInWithFirebaseGithub();
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }
      const resolvedSocialName =
        res.user?.displayName ||
        (res.githubUsername ? `@${res.githubUsername}` : undefined) ||
        res.user?.email?.split('@')[0] ||
        'Campus Builder';

      login(accountType, undefined, {
        name: resolvedSocialName,
        email: res.user?.email || undefined,
        avatar: res.user?.photoURL || undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `${provider} registration failed`;
      setErrorMsg(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-[#f8fafc] text-slate-900">
      <div className="max-w-md w-full space-y-6 relative z-10">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Already have an account? Sign In</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
              CS
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Campus Account
            </h1>
            <p className="text-xs text-slate-500">
              Join the high-trust proof-of-skill network to showcase work and discover verified talent.
            </p>
          </div>

          {/* Social One-Click Registration */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialRegister('google')}
              disabled={socialLoading !== null || loading}
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <GoogleIcon />
              <span>
                {socialLoading === 'google' ? 'Connecting to Google...' : 'Sign up with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialRegister('github')}
              disabled={socialLoading !== null || loading}
              className="w-full py-2.5 px-4 rounded-full bg-[#24292f] hover:bg-[#1b1f23] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <GithubIcon />
              <span>
                {socialLoading === 'github' ? 'Connecting to GitHub...' : 'Sign up with GitHub'}
              </span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              or register with credentials
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAccountType('student');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                accountType === 'student'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#1b59f8]" />
              <span>Student Builder</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountType('recruiter');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                accountType === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Tech Recruiter</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {accountType === 'student'
                  ? 'Institutional Email (.edu or .ac.in)'
                  : 'Company Work Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    accountType === 'student'
                      ? 'student@campus.edu'
                      : 'recruiter@company.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-mono"
                />
              </div>
            </div>

            {accountType === 'student' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={communityId}
                    onChange={(e) => setCommunityId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-sans"
                  >
                    {MOCK_COMMUNITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Agency Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Google, Datadog"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-sans"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Password
                </label>
                {password.length > 0 && password.length < 6 && (
                  <span className="text-[10px] text-amber-600 font-mono font-semibold">
                    Min 6 characters
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong passkey"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Confirm Password
                </label>
                {confirmPassword.length > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                      passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <span>✕ Passwords do not match</span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password to confirm"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f8fafc] border text-slate-900 placeholder-slate-400 text-xs focus:outline-none transition-all font-mono ${
                    passwordsMismatch
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : passwordsMatch
                      ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/20'
                      : 'border-slate-200 focus:border-[#1b59f8]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* DPDP Act 2023 Consent Notice */}
            <div className="rounded-xl p-3 bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#1b59f8] focus:ring-[#1b59f8]"
                />
                <span className="leading-tight text-[11px] text-slate-500">
                  I consent to the collection and processing of my data in accordance with the{' '}
                  <Link href="/privacy" target="_blank" className="text-[#1b59f8] font-bold hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/terms" target="_blank" className="text-[#1b59f8] font-bold hover:underline">
                    Terms of Service
                  </Link>
                  , under the Digital Personal Data Protection Act, 2023 (India).
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || socialLoading !== null || passwordsMismatch}
              className="w-full py-3 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : `Register as ${accountType === 'student' ? 'Student' : 'Recruiter'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already verified?{' '}
              <Link href="/sign-in" className="font-bold text-[#1b59f8] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
