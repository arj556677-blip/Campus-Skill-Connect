export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfileById, getWorks } from '@/lib/data/service';
import WorkCard from '@/components/cards/WorkCard';
import {
  ShieldCheck,
  Building,
  MapPin,
  Globe,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/SocialIcons';
import ProfileActions from './ProfileActions';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);
  if (!profile) return { title: 'Profile Not Found' };
  return {
    title: `${profile.display_name} — Campus Portfolio`,
    description: profile.headline || profile.bio || 'Verified Student Builder Profile',
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    notFound();
  }

  const allWorks = await getWorks();
  const userWorks = allWorks.filter((w) => w.owner_id === profile.id);

  return (
    <div className="min-h-screen bg-[#08090d] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/people"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Talent Directory</span>
        </Link>

        {/* Hero Portfolio Card */}
        <div className="rounded-2xl bento-card p-6 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Avatar & Main Credentials */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                    {profile.display_name.slice(0, 2)}
                  </div>
                )}
                {profile.is_verified && (
                  <span
                    title="Verified Institutional Student"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center ring-2 ring-[#0d0f17]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.display_name}
                  </h1>
                  <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    {profile.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online (Redis Active)
                  </span>
                </div>

                <p className="text-sm font-semibold text-zinc-300">
                  {profile.headline || profile.field}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1 font-mono">
                  {profile.institution && (
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-zinc-500" />
                      <span>{profile.institution.name}</span>
                    </span>
                  )}
                  {profile.zone && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <span>{profile.zone.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Social Links */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 self-stretch md:self-auto">
              <ProfileActions profileId={profile.id} />

              <div className="flex items-center gap-2 pt-2">
                {profile.github_username && (
                  <a
                    href={`https://github.com/${profile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                    title="GitHub Repositories"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                    title="Personal Site"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio statement */}
          {profile.bio && (
            <div className="pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Engineering Statement &amp; Research Focus
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Endorsed Skills Pill Matrix */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Verified Technical Competencies</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] text-xs font-mono font-medium text-zinc-200 border border-white/[0.08]"
                  >
                    #{(skill as any).skill?.name || (skill as any).name || 'Skill'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User's Verified Works Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Verified Proof of Work Repositories
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Submissions, live prototypes, and engineering documentation published by {profile.display_name}.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {userWorks.length} Item{userWorks.length === 1 ? '' : 's'}
            </span>
          </div>

          {userWorks.length === 0 ? (
            <div className="rounded-2xl bento-card border-dashed p-12 text-center max-w-md mx-auto">
              <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">No published work items yet</h4>
              <p className="text-xs text-zinc-400 mt-1">
                This creator hasn&apos;t shared public work items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
