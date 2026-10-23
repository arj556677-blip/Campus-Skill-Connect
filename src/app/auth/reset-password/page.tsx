'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { KeyRound, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isRecovery, setIsRecovery] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('type') === 'recovery' || window.location.hash.includes('type=recovery');
    }
    return false;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/reset-password?type=recovery`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'If an account exists with this email, a password reset link has been dispatched. Please check your inbox.',
        });
      }
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to request password reset',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'Your password has been successfully updated. You may now sign in with your new credentials.',
        });
      }
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>

        <div className="bento-card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {isRecovery ? 'Set New Password' : 'Reset Password'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              {isRecovery
                ? 'Enter a strong, secure password to regain access to your account.'
                : 'Enter your verified account email to receive a secure recovery link.'}
            </p>
          </div>

          {message && (
            <div
              role="alert"
              className={`p-3 rounded-[var(--radius-sm)] text-xs flex items-center gap-2.5 ${
                message.type === 'error'
                  ? 'bg-[var(--danger-bg)] border border-[var(--danger)] text-[var(--danger)]'
                  : 'bg-[var(--success-bg)] border border-[var(--success)] text-[var(--success)]'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {isRecovery ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-white text-xs placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              >
                <span>{loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[var(--border-subtle)] text-center">
            <Link
              href="/sign-in"
              className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Remember your password? <span className="text-[var(--accent)] font-semibold">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
