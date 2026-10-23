import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bento-card p-8 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center">
          <Compass className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            404 Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            The page you requested may have been removed, had its name changed, or requires authorized permission to access.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Explore Showcase</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
