'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Work } from '@/lib/types';
import WorkCard from '@/components/cards/WorkCard';
import { Search, Plus, Sparkles, Compass, SlidersHorizontal, X } from 'lucide-react';
import { WORK_CATEGORIES } from '@/lib/utils';

interface ShowcaseClientProps {
  initialWorks: Work[];
}

export default function ShowcaseClient({ initialWorks }: ShowcaseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'views'>('trending');

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Disciplines' },
      ...Object.entries(WORK_CATEGORIES).map(([id, label]) => ({ id, label })),
    ];
  }, []);

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
        if (sortBy === 'trending') return b.likes_count - a.likes_count;
        if (sortBy === 'views') return b.views_count - a.views_count;
        return new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime();
      });
  }, [initialWorks, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold mb-1.5">
            <Compass className="w-4 h-4" />
            <span>Redis-Accelerated Project Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Campus Work Showcase
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Live repositories, research artifacts, architecture blueprints, and design systems built by verified students.
          </p>
        </div>

        <Link
          href="/works/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all self-start md:self-end"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>Publish Work Item</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, skills (e.g. Redis, YOLO, Three.js), or authors..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#10121a] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-soft transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#10121a] border border-white/10 text-xs font-semibold rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
          >
            <option value="trending">Most Endorsed &amp; Liked</option>
            <option value="newest">Recently Published</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-md font-bold'
                  : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-zinc-400">
            Showing <strong className="text-white">{filteredWorks.length}</strong> verified work item{filteredWorks.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="rounded-3xl bento-card border-dashed p-12 text-center max-w-lg mx-auto">
            <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No work items found</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Try adjusting your search terms or select another category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
