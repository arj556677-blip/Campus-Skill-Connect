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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/people"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Talent Directory</span>
        </Link>

        {/* Hero Portfolio Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Avatar & Main Credentials */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1b59f8] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                    {profile.display_name.slice(0, 2)}
                  </div>
                )}
                {profile.is_verified && (
                  <span
                    title="Verified Institutional Student"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1b59f8] text-white flex items-center justify-center ring-2 ring-white"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profile.display_name}
                  </h1>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200">
                    {profile.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online (Redis Active)
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {profile.headline || profile.field}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  {profile.institution && (
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{profile.institution.name}</span>
                    </span>
                  )}
                  {profile.zone && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
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
                    className="p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
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
                    className="p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#1b59f8] hover:bg-slate-200 transition-colors"
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
                    className="p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
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
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Engineering Statement &amp; Research Focus
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Endorsed Skills Pill Matrix */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>Verified Technical Competencies</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => {
                  const name = 'skill' in skill && skill.skill ? skill.skill.name : (skill as { name?: string }).name || 'Skill';
                  return (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200"
                    >
                      #{name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User's Verified Works Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Verified Proof of Work Repositories
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submissions, live prototypes, and engineering documentation published by {profile.display_name}.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {userWorks.length} Item{userWorks.length === 1 ? '' : 's'}
            </span>
          </div>

          {userWorks.length === 0 ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">No published work items yet</h4>
              <p className="text-xs text-slate-500 mt-1">
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
