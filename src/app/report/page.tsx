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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report. Please ensure you are signed in.');
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push('/showcase');
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showcase</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>COMMUNITY TRUST &amp; SAFETY REPORT</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Report Content or Account
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Target ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-800 border border-slate-200">{targetId}</code> ({targetType})
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-950">Report Dispatched to Moderation Queue</h3>
              <p className="text-xs text-slate-600">
                Thank you for keeping Campus Skill Connect safe. Our moderation team and institution leads will review this within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="Copyright or Plagiarism">Copyright or Plagiarism (Uncredited code/asset)</option>
                  <option value="Misleading Claims">Misleading Claims / Fake Repository</option>
                  <option value="Inappropriate Content">Inappropriate or Offensive Material</option>
                  <option value="Harassment or Spam">Unsolicited Recruiter Outreach / Harassment</option>
                  <option value="Other">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Explanation / Evidence *
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide URLs or specific reasons why this violates academic integrity or community guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs leading-relaxed focus:outline-none focus:border-rose-500"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <p className="text-sm text-slate-500">Loading report form...</p>
        </div>
      }
    >
      <ReportForm />
    </Suspense>
  );
}
