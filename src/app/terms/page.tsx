import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, ArrowLeft, Eye, Server } from 'lucide-react';

export const metadata = {
  title: 'Privacy & Architecture Policies — Campus Skill Connect',
  description: 'Our commitment to zero-scraping, consent-based networking, and cryptographic row-level security.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>STUDENT-FIRST PRIVACY CHARTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Architecture &amp; RLS Policies
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            How Campus Skill Connect enforces granular privacy and protects student proof-of-work.
          </p>
        </div>

        <div className="rounded-3xl bg-[#0e1017] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8 leading-relaxed text-sm text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-400" />
              <span>1. Granular Visibility Levels</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Unlike traditional social networks where all content is either completely public or completely private, Campus Skill Connect enables 5 distinct privacy boundaries per work item:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-zinc-300 font-mono">
              <li><strong className="text-white">Worldwide:</strong> Indexed for discoverability across global campus networks and approved recruiters.</li>
              <li><strong className="text-white">Campus Only:</strong> Visible exclusively to students and faculty possessing a verified email domain from your university.</li>
              <li><strong className="text-white">Connections Only:</strong> Restricted to members with whom you have mutually accepted connection requests.</li>
              <li><strong className="text-white">Selected Users:</strong> Fine-grained capability grants designated on a per-user basis.</li>
              <li><strong className="text-white">Only Me:</strong> Confidential student draft workspace.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>2. PostgreSQL Row-Level Security (RLS) Enforcement</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Security is enforced at the database kernel level, not just in application middleware. Every query executed against our 23 database tables automatically evaluates row-level tenant security expressions tied to your authenticated JWT signature.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>3. Redis In-Memory Cache Isolation &amp; Invalidation</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cached query responses stored in Redis are automatically scoped to permission boundaries. When a member updates their project visibility, atomic cache purge commands wipe corresponding keys across the Redis cluster in sub-millisecond intervals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>4. Recruiter Anti-Scraping Protection</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We prohibit third-party automated web scraping of student portfolios. Recruiter accounts must be authenticated and validated with corporate or institution domains, and adhere to sliding-window rate limits (NGINX + Redis).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
