import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, ArrowLeft, Eye, Server } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Architecture Policies — Campus Skill Connect',
  description: 'Our commitment to zero-scraping, consent-based networking, and cryptographic row-level security.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:underline"
          >
            <span>View Full Privacy Policy ↗</span>
          </Link>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs uppercase tracking-wider text-emerald-800 font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>STUDENT-FIRST PRIVACY CHARTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service &amp; System Architecture
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            How Campus Skill Connect enforces granular privacy and protects student proof-of-work.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Looking for our official Data Protection Policy?</p>
              <p className="text-[11px] text-slate-600">Review our statutory DPDP Act 2023 &amp; GDPR compliance disclosures, sub-processors, and Grievance Officer details.</p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            Read Privacy Policy ↗
          </Link>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 leading-relaxed text-sm text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#1b59f8]" />
              <span>1. Granular Visibility Levels</span>
            </h2>
            <p className="text-xs text-slate-500">
              Unlike traditional social networks where all content is either completely public or completely private, Campus Skill Connect enables 5 distinct privacy boundaries per work item:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-700">
              <li><strong className="text-slate-900">Worldwide:</strong> Indexed for discoverability across global campus networks and approved recruiters.</li>
              <li><strong className="text-slate-900">Campus Only:</strong> Visible exclusively to students and faculty possessing a verified email domain from your university.</li>
              <li><strong className="text-slate-900">Connections Only:</strong> Restricted to members with whom you have mutually accepted connection requests.</li>
              <li><strong className="text-slate-900">Selected Users:</strong> Fine-grained capability grants designated on a per-user basis.</li>
              <li><strong className="text-slate-900">Only Me:</strong> Confidential student draft workspace.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>2. Cryptographic Row-Level Tenant Security Enforcement</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Security is enforced at the core database level, not just in application middleware. Every query executed against our database records automatically evaluates strict tenant-isolation security expressions tied to your cryptographically verified session signature.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>3. Edge Cache Isolation &amp; Instant Invalidation</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cached query responses are strictly scoped to permission boundaries. When a member updates their project visibility, atomic cache purge commands wipe corresponding cached keys across edge clusters in sub-millisecond intervals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-600" />
              <span>4. Recruiter Anti-Scraping Protection</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We prohibit third-party automated web scraping of student portfolios. Recruiter accounts must be authenticated and validated with corporate or institution domains, and adhere to sliding-window rate limits and automated anti-abuse safeguards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
