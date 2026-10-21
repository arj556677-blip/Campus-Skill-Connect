import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, ArrowLeft, Eye, Server } from 'lucide-react';

export const metadata = {
  title: 'Privacy & Architecture Policies — Campus Skill Connect',
  description: 'Our commitment to zero-scraping, consent-based networking, and cryptographic row-level security.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>STUDENT-FIRST PRIVACY CHARTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-ink)]">
            Privacy Architecture & RLS Policies
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">
            How Campus Skill Connect enforces granular privacy and protects student proof-of-work.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[var(--color-border)] p-6 sm:p-10 shadow-soft space-y-8 leading-relaxed text-sm text-[var(--color-ink-muted)]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--color-brand-primary)]" />
              1. Granular Visibility Levels
            </h2>
            <p>
              Unlike traditional social networks where all content is either completely public or completely private, Campus Skill Connect enables 5 distinct privacy boundaries per work item:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
              <li><strong>Worldwide:</strong> Indexed for discoverability across global campus networks and approved recruiters.</li>
              <li><strong>Campus Only:</strong> Visible exclusively to students and faculty possessing a verified email domain from your university.</li>
              <li><strong>Connections Only:</strong> Restricted to members with whom you have mutually accepted connection requests.</li>
              <li><strong>Selected Users:</strong> Fine-grained capability grants designated on a per-user basis.</li>
              <li><strong>Only Me:</strong> Confidential student draft workspace.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              2. PostgreSQL Row-Level Security (RLS) Enforcement
            </h2>
            <p>
              Security is enforced at the database kernel level, not just in application middleware. Every query executed against our 23 database tables automatically evaluates row-level tenant security expressions tied to your JWT signature.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              3. Redis In-Memory Cache Isolation & Invalidation
            </h2>
            <p>
              Cached query responses stored in Redis are automatically scoped to permission boundaries. When a member updates their project visibility, atomic cache purge commands wipe corresponding keys across the Redis cluster in sub-millisecond intervals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-600" />
              4. Recruiter Anti-Scraping Protection
            </h2>
            <p>
              We prohibit third-party automated web scraping of student portfolios. Recruiter accounts must be authenticated and validated with corporate or institution domains, and adhere to sliding-window rate limits (NGINX + Redis).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
