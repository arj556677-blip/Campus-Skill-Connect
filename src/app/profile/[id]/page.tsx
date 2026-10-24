export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfileById, getWorks } from '@/lib/data/service';
import { getUser, createServerSupabaseClient } from '@/lib/supabase/server';
import { isOnline } from '@/lib/redis/session';
import WorkCard from '@/components/cards/WorkCard';
import ProfileExperienceTabs from '@/components/profile/ProfileExperienceTabs';
import ProfilePresenceBadge from '@/components/profile/ProfilePresenceBadge';
import ProfileSkillsFolder from '@/components/profile/ProfileSkillsFolder';
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

  const currentUser = await getUser();
  const isOwner = currentUser?.id === profile.id;

  // Determine relationship status between viewer and target profile
  let connectionStatus: 'none' | 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked' = 'none';
  let isIncoming = false;

  if (currentUser && !isOwner) {
    try {
      const supabase = await createServerSupabaseClient();
      const userLow = currentUser.id < profile.id ? currentUser.id : profile.id;
      const userHigh = currentUser.id < profile.id ? profile.id : currentUser.id;

      const { data: conn } = await supabase
        .from('connections')
        .select('*')
        .eq('user_low', userLow)
        .eq('user_high', userHigh)
        .single();

      if (conn) {
        connectionStatus = conn.status;
        isIncoming = conn.requested_by === profile.id && conn.status === 'pending';
      }
    } catch {
      // Fallback is handled seamlessly by client persistence
    }
  }

  // Check online status in Redis presence store
  const userIsOnline = isOwner ? true : await isOnline(profile.id);

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
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      profile.role === 'faculty'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : profile.role === 'recruiter'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : profile.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-blue-50 text-[#1b59f8] border-blue-200'
                    }`}
                  >
                    {profile.role === 'faculty'
                      ? 'Faculty Mentor'
                      : profile.role === 'recruiter'
                      ? 'Tech Recruiter'
                      : profile.role === 'admin'
                      ? 'Admin'
                      : 'Student Builder'}
                  </span>
                  {/* Dynamic Redis Presence: Online only if active in Redis */}
                  <ProfilePresenceBadge
                    profileId={profile.id}
                    initialOnline={userIsOnline}
                    isCurrentUser={isOwner}
                  />
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
              <ProfileActions
                profileId={profile.id}
                initialStatus={connectionStatus}
                isIncoming={isIncoming}
              />

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

          {/* Interactive Skills Floating Folder */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <ProfileSkillsFolder
                skills={profile.skills}
                title="Verified Technical Competencies"
                variant="light"
              />
            </div>
          )}
        </div>

        {/* User's Verified Works, LinkedIn-style Certificates & Badges, and Achievement Photo Posts */}
        <ProfileExperienceTabs
          profile={profile}
          works={userWorks}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
