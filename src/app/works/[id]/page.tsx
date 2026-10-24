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

  // Tier 2 Requirement: Private items never generate public previews
  if (work.visibility === 'only_me' || work.visibility === 'connections') {
    return {
      title: 'Restricted Item — Campus Skill Connect',
      description: 'This work item is restricted to authorized connections.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${work.title} — Campus Skill Connect`,
    description: work.description,
    openGraph: {
      title: work.title,
      description: work.description || 'Verified Campus Proof-of-Work',
      type: 'article',
      images: work.storage_path ? [{ url: work.storage_path }] : [],
    },
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Showcase</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
              Visibility: {work.visibility}
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
              {getCategoryLabel(work.category)}
            </span>
            <span suppressHydrationWarning className="text-xs text-slate-500 font-mono">
              Published on {new Date(work.published_at ?? work.created_at).toISOString().split('T')[0]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
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
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b59f8] to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                    {work.owner.display_name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">
                    {work.owner.display_name}
                  </h4>
                  <p className="text-xs text-slate-500">
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
          <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
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
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">
                Project Overview &amp; Architecture
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4 font-sans">
                <p>{work.description}</p>
                <p className="text-slate-500 text-xs">
                  This work represents verified campus production evidence. The repository code,
                  system diagrams, and benchmarking were submitted and reviewed through peer endorsements.
                </p>
              </div>
            </div>

            {/* External Links */}
            {work.external_url && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={work.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Launch Live Demonstration / Repository</span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar: Skills & Verification */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-xs">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Verified Technologies &amp; Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {work.skills?.map((skill, index) => {
                    const skillId =
                      skill?.id ||
                      (skill as { skills?: { id?: string } })?.skills?.id ||
                      skill?.name ||
                      (skill as { skills?: { name?: string } })?.skills?.name ||
                      `work-skill-${work.id}-${index}`;
                    const skillName =
                      skill?.name ||
                      (skill as { skills?: { name?: string } })?.skills?.name ||
                      (typeof skill === 'string' ? skill : 'Skill');
                    return (
                      <span
                        key={skillId}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-mono font-semibold text-[#1b59f8] border border-blue-200"
                      >
                        <Sparkles className="w-3 h-3 text-[#1b59f8]" />
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-mono">
                <div className="flex items-center justify-between">
                  <span>Views</span>
                  <span className="font-semibold text-slate-900">
                    {work.views_count ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Endorsement Likes</span>
                  <span className="font-semibold text-rose-600">
                    {work.likes_count ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trust Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Work
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/report?type=work&id=${work.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors"
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
          <div className="pt-10 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
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
