import React from 'react';

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading page content">
      {/* Top Banner / Breadcrumb Skeleton */}
      <div className="h-4 w-40 bg-[var(--border)] rounded-[var(--radius-sm)]" />

      {/* Hero Header Skeleton */}
      <div className="bento-card p-8 space-y-4">
        <div className="h-8 w-1/3 bg-[var(--border)] rounded-[var(--radius-sm)]" />
        <div className="h-4 w-2/3 bg-[var(--border-subtle)] rounded-[var(--radius-sm)]" />
        <div className="h-4 w-1/2 bg-[var(--border-subtle)] rounded-[var(--radius-sm)]" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bento-card p-6 space-y-4">
            <div className="h-5 w-3/4 bg-[var(--border)] rounded-[var(--radius-sm)]" />
            <div className="h-3 w-full bg-[var(--border-subtle)] rounded-[var(--radius-sm)]" />
            <div className="h-3 w-5/6 bg-[var(--border-subtle)] rounded-[var(--radius-sm)]" />
            <div className="pt-4 flex items-center justify-between border-t border-[var(--border-subtle)]">
              <div className="h-4 w-20 bg-[var(--border-subtle)] rounded-full" />
              <div className="h-4 w-16 bg-[var(--border-subtle)] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
