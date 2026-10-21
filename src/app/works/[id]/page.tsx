export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorkById, getWorks } from '@/lib/data/service';
import { getCategoryLabel } from '@/lib/utils';
import {
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import WorkCard from '@/components/cards/WorkCard';
import WorkActions from './WorkActions';

interface WorkPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) return { title: 'Work Item Not Found' };
  return {
    title: `${work.title} — Campus Skill Connect`,
    description: work.description,
  };
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { id } = await params;
  const work = await getWorkById(id);

  if (!work) {
    notFound();
  }

  const allWorks = await getWorks();
  const relatedWorks = allWorks
    .filter((w) => w.id !== work.id && (w.category === work.category || w.owner_id === work.owner_id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Showcase</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
              Visibility: {work.visibility}
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 text-xs font-mono font-bold uppercase tracking-wider">
              {getCategoryLabel(work.category)}
            </span>
            <span suppressHydrationWarning className="text-xs text-zinc-500 font-mono">
              Published on {new Date(work.published_at ?? work.created_at).toISOString().split('T')[0]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {work.title}
          </h1>

          {/* Author Strip */}
          {work.owner && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href={`/profile/${work.owner.id}`}
                className="flex items-center gap-3 group"
              >
                {work.owner.avatar_url ? (
                  <img
                    src={work.owner.avatar_url}
                    alt={work.owner.display_name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                    {work.owner.display_name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    {work.owner.display_name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {work.owner.headline || work.owner.field}
                  </p>
                </div>
              </Link>

              <WorkActions
                workId={work.id}
                initialLikes={work.likes_count}
                externalUrl={work.external_url}
              />
            </div>
          )}
        </div>

        {/* Media Preview Card */}
        {work.storage_path && (
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#10121a]">
            <img
              src={work.storage_path}
              alt={work.title}
              className="w-full h-auto max-h-[520px] object-cover"
            />
          </div>
        )}

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Description */}
          <div className="lg:col-span-8 rounded-2xl bento-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-3">
                Project Overview &amp; Architecture
              </h2>
              <div className="prose prose-invert prose-sm text-sm text-zinc-300 leading-relaxed space-y-4">
                <p>{work.description}</p>
                <p className="text-zinc-400 text-xs">
                  This work represents verified campus production evidence. The repository code,
                  system diagrams, and benchmarking were submitted and reviewed through peer endorsements.
                </p>
              </div>
            </div>

            {/* External Links */}
            {work.external_url && (
              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-3">
                <a
                  href={work.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-300" />
                  <span>Launch Live Demonstration / Repository</span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar: Skills & Verification */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bento-card p-6 space-y-5">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">
                  Verified Technologies &amp; Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {work.skills?.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs font-mono font-semibold text-zinc-300 border border-white/[0.08]"
                    >
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center justify-between">
                  <span>Views</span>
                  <span className="font-semibold text-white">
                    {work.views_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Endorsement Likes</span>
                  <span className="font-semibold text-rose-400">
                    {work.likes_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trust Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Work
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/report?type=work&id=${work.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report content or copyright</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Works Grid */}
        {relatedWorks.length > 0 && (
          <div className="pt-10 border-t border-white/[0.08]">
            <h3 className="text-xl font-bold text-white mb-6">
              More Works by Author or Discipline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedWorks.map((item) => (
                <WorkCard key={item.id} work={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
