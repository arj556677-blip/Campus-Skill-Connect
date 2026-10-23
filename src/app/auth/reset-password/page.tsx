'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';

type Step = 'email' | 'otp' | 'new_password' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Multi-step state
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UX Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);

  // Resend Countdown
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Refs for 6 OTP input boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect
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

  // 1. Send OTP to Registered Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
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
      setSuccessMsg(data.message || `Verification code sent to ${email.trim()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending verification code';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Segmented OTP Inputs (Auto-advance, backspace, paste)
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // User pasted or multi-char input
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

    // Auto-advance to next box if digit entered
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  // 3. Verify OTP Code
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setResetToken(data.resetToken);
      setStep('new_password');
      setSuccessMsg('Verification code confirmed! Now enter your new password.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid code verification';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    if (!resetToken) {
      setErrorMsg('Verification session expired. Please start over.');
      setStep('email');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setStep('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-[#f8fafc] text-slate-900">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Back Link */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        {/* Main Dribbble Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Top Step Progress Bar */}
          {step !== 'success' && (
            <div className="space-y-2 pb-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold uppercase">
                <span>
                  {step === 'email' ? 'Step 1: Account Email' : step === 'otp' ? 'Step 2: Verification Code' : 'Step 3: New Password'}
                </span>
                <span>{step === 'email' ? '1 of 3' : step === 'otp' ? '2 of 3' : '3 of 3'}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="h-full bg-[#1b59f8] transition-all duration-300 rounded-full"
                  style={{
                    width: step === 'email' ? '33.3%' : step === 'otp' ? '66.6%' : '100%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && step !== 'success' && (
            <div
              role="status"
              className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: EMAIL ENTRY
             ───────────────────────────────────────────────────────────── */}
          {step === 'email' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center mx-auto shadow-xs">
                  <KeyRound className="w-5 h-5 text-blue-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  No worries! Enter your registered account email and we&apos;ll send a 6-digit verification code to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu or name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: DRIBBLE 6-DIGIT OTP VERIFICATION
             ───────────────────────────────────────────────────────────── */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b59f8] flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <Mail className="w-5 h-5 text-[#1b59f8]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Check Your Email
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  We sent a 6-digit code to <strong className="text-slate-800">{email}</strong>. Enter the code below to verify your account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMsg(null);
                  }}
                  className="text-[11px] font-semibold text-[#1b59f8] hover:underline"
                >
                  Wrong email? Change email
                </button>
              </div>

              {/* Developer / Demo Quick-Paste Banner */}
              {previewOtp && (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1b59f8] shrink-0" />
                    <span>Demo mode code: <strong className="font-mono text-sm tracking-widest">{previewOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = previewOtp.split('');
                      setOtpDigits(digits);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#1b59f8] text-white text-[10px] font-bold shrink-0 hover:bg-[#174ed8]"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Dribbble 6-Digit Segmented Boxes */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
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
                        onPaste={idx === 0 ? handlePasteOtp : undefined}
                        className={`w-11 h-14 sm:w-12 sm:h-14 rounded-2xl border text-center text-xl font-mono font-extrabold transition-all shadow-xs focus:outline-none ${
                          digit
                            ? 'border-[#1b59f8] bg-blue-50/40 text-slate-900 ring-2 ring-[#1b59f8]/20'
                            : 'border-slate-200 bg-[#f8fafc] text-slate-900 hover:border-slate-300 focus:border-[#1b59f8] focus:bg-white focus:ring-2 focus:ring-[#1b59f8]/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Resend Timer & Button */}
                  <div className="mt-4 text-center">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={loading}
                        className="text-xs font-bold text-[#1b59f8] hover:text-[#174ed8] hover:underline transition-colors"
                      >
                        Didn&apos;t receive code? Resend Code
                      </button>
                    ) : (
                      <p className="text-xs text-slate-400 font-mono">
                        Didn&apos;t receive code? Resend in <strong className="text-slate-600">{resendTimer}s</strong>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length < 6}
                  className="w-full py-2.5 px-4 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: NEW PASSWORD & CONFIRM PASSWORD
             ───────────────────────────────────────────────────────────── */}
          {step === 'new_password' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Code verified! Create a strong, secure password for <strong className="text-slate-800">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Input 1: New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-all shadow-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength checklist */}
                <div className="space-y-1 px-1">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className={hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                      At least 8 characters long
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumberOrSymbol ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className={hasNumberOrSymbol ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                      Contains numbers or symbols
                    </span>
                  </div>
                </div>

                {/* Input 2: Confirm New Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                      Confirm New Password
                    </label>
                    {confirmPassword && (
                      <span className={`text-[10px] font-mono font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {passwordsMatch ? '✓ Passwords match' : '✕ Do not match'}
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
                      placeholder="Re-enter your new password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f8fafc] border text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:bg-white transition-all shadow-xs font-mono ${
                        confirmPassword && !passwordsMatch
                          ? 'border-rose-300 focus:border-rose-500'
                          : confirmPassword && passwordsMatch
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-slate-200 focus:border-[#1b59f8]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !hasMinLength || !passwordsMatch}
                  className="w-full py-2.5 px-4 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Change Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: SUCCESS STATE
             ───────────────────────────────────────────────────────────── */}
          {step === 'success' && (
            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Password Changed!
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Your password has been successfully updated. You can now use your new password to sign into your Campus Skill Connect account.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/sign-in?email=${encodeURIComponent(email)}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <span>Log In With New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
