'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetType = searchParams.get('type') || 'work';
  const targetId = searchParams.get('id') || 'unknown';

  const [reason, setReason] = useState('Copyright or Plagiarism');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/showcase');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </Link>

        <div className="rounded-3xl bg-white border border-[var(--color-border)] p-6 sm:p-8 shadow-elevated space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              <span>COMMUNITY TRUST & SAFETY REPORT</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)] mt-1">
              Report Content or Account
            </h1>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
              Target ID: <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">{targetId}</code> ({targetType})
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-900">Report Dispatched to Moderation Queue</h3>
              <p className="text-xs text-emerald-700">
                Thank you for keeping Campus Skill Connect safe. Our moderation team and institution leads will review this within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white"
                >
                  <option value="Copyright or Plagiarism">Copyright or Plagiarism (Uncredited code/asset)</option>
                  <option value="Misleading Claims">Misleading Claims / Fake Repository</option>
                  <option value="Inappropriate Content">Inappropriate or Offensive Material</option>
                  <option value="Harassment or Spam">Unsolicited Recruiter Outreach / Harassment</option>
                  <option value="Other">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
                  Detailed Explanation / Evidence *
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide URLs or specific reasons why this violates academic integrity or community guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-soft hover:bg-rose-700 transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center">
          <p className="text-sm text-zinc-400">Loading report form...</p>
        </div>
      }
    >
      <ReportForm />
    </Suspense>
  );
}
