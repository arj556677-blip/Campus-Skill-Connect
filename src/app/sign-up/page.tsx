'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRole } from '@/lib/auth/role-context';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const { login, isLoggedIn, isMounted, currentUser } = useRole();

  // If already logged in, redirect away from sign-up immediately
  useEffect(() => {
    if (isMounted && isLoggedIn && currentUser) {
      router.replace(currentUser.dashboardUrl || '/dashboard/student');
    }
  }, [isMounted, isLoggedIn, currentUser, router]);

  // Multi-step signup: 'details' -> 'otp'
  const [step, setStep] = useState<'details' | 'otp'>('details');

  // Form Fields
  const [accountType, setAccountType] = useState<'student' | 'faculty' | 'recruiter'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [communityId, setCommunityId] = useState(MOCK_COMMUNITIES[0].id);
  const [facultyDepartment, setFacultyDepartment] = useState('Computer Science & Engineering');
  const [companyName, setCompanyName] = useState('Stripe');
  const [consentGiven, setConsentGiven] = useState(false);

  // OTP Fields
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Step 1: Dispatch OTP to user's email
  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }

    if (!consentGiven) {
      setErrorMsg('Please consent to data processing under the DPDP Act 2023 to proceed.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Dispatch 6-digit OTP to user's email
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      if (data.previewOtp) {
        setPreviewOtp(data.previewOtp);
      }

      setStep('otp');
      setResendTimer(45);
      setCanResend(false);
      setSuccessMsg(`A 6-digit verification code was sent to ${email.trim()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending verification code';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle Segmented OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillPreviewOtp = () => {
    if (previewOtp && previewOtp.length === 6) {
      setOtpDigits(previewOtp.split(''));
      setErrorMsg(null);
    }
  };

  // Step 3: Verify OTP & Complete Registration
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Verify OTP code via backend
      const verifyRes = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: enteredOtp,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Invalid or expired verification code.');
      }

      // 2. Register account in Supabase
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name.trim(),
            institution_id: accountType === 'student' || accountType === 'faculty' ? communityId : null,
            company_name: accountType === 'recruiter' ? companyName : null,
            field: accountType === 'faculty' ? facultyDepartment : null,
            role: accountType,
          },
        },
      });

      if (signUpError && !signUpError.message.includes('placeholder')) {
        console.warn('[SignUp] Supabase notice:', signUpError.message);
      }

      // 3. Log in user and navigate to Profile Edit / Onboarding to add details!
      login(accountType, '/profile/edit?onboarding=true', {
        name: name.trim() || email.trim().split('@')[0],
        email: email.trim(),
        institution:
          accountType === 'student'
            ? MOCK_COMMUNITIES.find((c) => c.id === communityId)?.name || 'IISc Bangalore'
            : companyName,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Social One-Click Registration
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

      login(accountType, '/profile/edit?onboarding=true', {
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

  if (isMounted && isLoggedIn && currentUser) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-[#1b59f8] rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Already Signed In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Redirecting to your {currentUser.roleLabel} dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] text-slate-900">
      <div className="max-w-md w-full space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
              CS
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 'details' ? 'Create Campus Account' : 'Verify Your Email'}
            </h1>
            <p className="text-xs text-slate-500">
              {step === 'details'
                ? 'Join Campus Skill Connect to showcase verified proof of work and discover teammates.'
                : `Enter the 6-digit code dispatched to ${email}`}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── STEP 1: ACCOUNT DETAILS ── */}
          {step === 'details' && (
            <>
              {/* Account Type 3-Way Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Your Campus Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('student');
                      setErrorMsg(null);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                      accountType === 'student'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#1b59f8]" />
                    <span className="truncate">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('faculty');
                      setErrorMsg(null);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                      accountType === 'faculty'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="truncate">Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('recruiter');
                      setErrorMsg(null);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                      accountType === 'recruiter'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">Recruiter</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 px-1 font-mono text-center">
                  {accountType === 'student' && 'Build portfolio & share code proof with recruiters.'}
                  {accountType === 'faculty' && 'Publish academic lab research & mentor student builders.'}
                  {accountType === 'recruiter' && 'Source vetted emerging talent through verifiable works.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleInitiateSignUp} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {accountType === 'student' ? 'Campus Email Address' : 'Corporate Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={accountType === 'student' ? 'student@campus.edu or your personal email' : 'recruiter@company.com'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    We will send a 6-digit one-time verification code to this email.
                  </p>
                </div>

                {/* Institution or Company */}
                {accountType === 'student' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Accredited Institution</label>
                    <select
                      value={communityId}
                      onChange={(e) => setCommunityId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    >
                      {MOCK_COMMUNITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.domain})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Google, Microsoft"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b59f8]/20 focus:border-[#1b59f8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* DPDP Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#1b59f8] focus:ring-[#1b59f8]"
                    />
                    <span>
                      I consent to academic portfolio storage and university verification in compliance with India&apos;s DPDP Act 2023.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Sending Verification Code...</span>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Alternatives */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] text-center text-slate-400 font-medium mb-3">Or quick register with</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialRegister('google')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialRegister('github')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <GithubIcon />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP VERIFICATION ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <KeyRound className="w-4 h-4 text-[#1b59f8]" />
                  <span>Enter 6-Digit Email Code</span>
                </div>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  Check your inbox for <strong>{email}</strong>. Enter the 6-digit one-time code below to verify your identity.
                </p>

                {/* Instant Dev Helper if previewOtp is available */}
                {previewOtp && (
                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-600">
                      Code: <strong className="font-mono text-slate-900 text-xs">{previewOtp}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillPreviewOtp}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 transition-colors"
                    >
                      Auto-fill Code
                    </button>
                  </div>
                )}
              </div>

              {/* 6 Segmented Input Boxes */}
              <div className="flex items-center justify-between gap-2 max-w-xs mx-auto">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1b59f8] focus:border-[#1b59f8] shadow-xs"
                  />
                ))}
              </div>

              {/* Resend Code Action */}
              <div className="text-center text-xs text-slate-500">
                {resendTimer > 0 ? (
                  <span>Resend code in <strong className="text-slate-800">{resendTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleInitiateSignUp}
                    className="text-[#1b59f8] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Verification Code</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length < 6}
                  className="w-full py-3 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setErrorMsg(null);
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Edit Email / Registration Details
                </button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-bold text-[#1b59f8] hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
