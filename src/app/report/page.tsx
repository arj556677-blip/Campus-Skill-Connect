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
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showcase</span>
        </Link>

        <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-mono font-bold text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>COMMUNITY TRUST &amp; SAFETY REPORT</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Report Content or Account
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Target ID: <code className="bg-black/50 px-1.5 py-0.5 rounded text-[11px] text-zinc-300 border border-white/10">{targetId}</code> ({targetType})
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-sm text-white">Report Dispatched to Moderation Queue</h3>
              <p className="text-xs text-zinc-300">
                Thank you for keeping Campus Skill Connect safe. Our moderation team and institution leads will review this within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="Copyright or Plagiarism" className="bg-[#141722] text-white">Copyright or Plagiarism (Uncredited code/asset)</option>
                  <option value="Misleading Claims" className="bg-[#141722] text-white">Misleading Claims / Fake Repository</option>
                  <option value="Inappropriate Content" className="bg-[#141722] text-white">Inappropriate or Offensive Material</option>
                  <option value="Harassment or Spam" className="bg-[#141722] text-white">Unsolicited Recruiter Outreach / Harassment</option>
                  <option value="Other" className="bg-[#141722] text-white">Other Policy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Detailed Explanation / Evidence *
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide URLs or specific reasons why this violates academic integrity or community guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg transition-all"
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
        <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
          <p className="text-sm text-zinc-400 font-mono">Loading report form...</p>
        </div>
      }
    >
      <ReportForm />
    </Suspense>
  );
}
