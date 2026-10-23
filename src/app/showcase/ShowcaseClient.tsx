'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Work } from '@/lib/types';
import WorkCard from '@/components/cards/WorkCard';
import { Search, Plus, Compass, SlidersHorizontal, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { WORK_CATEGORIES } from '@/lib/utils';

interface ShowcaseClientProps {
  initialWorks: Work[];
}

const PAGE_SIZE = 24;

export default function ShowcaseClient({ initialWorks }: ShowcaseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL-synced states
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = (searchParams.get('sort') || 'newest') as 'trending' | 'newest' | 'views';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Helper to update search params
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || (key === 'category' && val === 'all') || (key === 'page' && val === '1')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`/showcase?${params.toString()}`, { scroll: false });
  };

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Disciplines' },
      ...Object.entries(WORK_CATEGORIES).map(([id, label]) => ({ id, label })),
    ];
  }, []);

  // Filter and sort items based on real columns
  const filteredWorks = useMemo(() => {
    return initialWorks
      .filter((work) => {
        const matchesCategory =
          selectedCategory === 'all' || work.category === selectedCategory;
        const matchesQuery =
          !searchQuery ||
          work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (work.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          work.skills?.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          work.owner?.display_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'trending') return (b.likes_count ?? 0) - (a.likes_count ?? 0);
        if (sortBy === 'views') return (b.views_count ?? 0) - (a.views_count ?? 0);
        return new Date(b.published_at ?? b.created_at ?? 0).getTime() - new Date(a.published_at ?? a.created_at ?? 0).getTime();
      });
  }, [initialWorks, selectedCategory, searchQuery, sortBy]);

  // Pagination (24 per page)
  const totalResults = filteredWorks.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE) || 1;
  const paginatedWorks = filteredWorks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>Peer-Reviewed Project Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Campus Work Showcase
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
            Live repositories, research artifacts, engineering blueprints, and creative works published by verified students and faculty.
          </p>
        </div>

        <Link
          href="/works/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors self-start md:self-end active:scale-95"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Publish Work Item</span>
        </Link>
      </div>

      {/* Filter and Search Bar with URL-synced state */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParams({ q: e.target.value, page: '1' })}
            placeholder="Search projects, skills, or authors..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1b59f8] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => updateParams({ q: null, page: '1' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-xs font-mono text-slate-500">
            Showing <strong className="text-slate-900">{totalResults}</strong> {totalResults === 1 ? 'work' : 'works'}
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sort: e.target.value, page: '1' })}
              className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#1b59f8]"
            >
              <option value="newest">Latest Published</option>
              <option value="trending">Most Endorsed</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (URL-synced) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Disciplinary categories">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => updateParams({ category: cat.id, page: '1' })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1b59f8] text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/80 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Grid */}
      {paginatedWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="bento-card p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center">
            <Search className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              No Evidence Found
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              No published works matched your search or discipline criteria. Try broadening your keywords or removing filters.
            </p>
          </div>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => updateParams({ category: null, q: null, page: '1' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
          <button
            onClick={() => updateParams({ page: String(currentPage - 1) })}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => updateParams({ page: String(currentPage + 1) })}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
