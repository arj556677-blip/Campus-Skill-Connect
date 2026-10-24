export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { getWorks, getWorksForProfile } from '@/lib/data/service';
import { Profile } from '@/lib/types';
import WorkCard from '@/components/cards/WorkCard';
import ProfileActions from '@/app/profile/[id]/ProfileActions';
import SkillEvidenceBadge from './SkillEvidenceBadge';
import ProfileExperienceTabs from '@/components/profile/ProfileExperienceTabs';
import {
  ShieldCheck,
  Building,
  MapPin,
  ArrowLeft,
  Lock,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface PublicProfileProps {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: PublicProfileProps) {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();
  
  // Find by username or id
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, headline, bio, profile_visibility, avatar_url')
    .or(`username.eq.${username},id.eq.${username}`)
    .single();

  // Tier 2 Requirement: Private profiles never generate public previews
  if (!profile || profile.profile_visibility === 'only_me' || profile.profile_visibility === 'connections') {
    return {
      title: 'Profile — Campus Skill Connect',
      description: 'Private campus profile.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${profile.display_name} — Campus Portfolio`,
    description: profile.headline || profile.bio || 'Verified Student Builder Profile',
    openGraph: {
      title: `${profile.display_name} (@${username})`,
      description: profile.headline || 'Verified Student Builder Profile on Campus Skill Connect',
      type: 'profile',
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PublicProfileProps) {
  const { username } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPreviewMode = resolvedSearchParams.preview === 'public';

  const supabase = await createServerSupabaseClient();
  const currentUser = await getUser();

  // 1. Fetch target profile
  let targetProfile: Profile | null = null;
  const { data: byUsername } = await supabase
    .from('profiles')
    .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
    .eq('username', username)
    .single();

  if (byUsername) {
    targetProfile = byUsername as unknown as Profile;
  } else {
    // Try by ID
    const { data: byId } = await supabase
      .from('profiles')
      .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
      .eq('id', username)
      .single();
    targetProfile = byId as unknown as Profile;
  }

  if (!targetProfile) {
    notFound();
  }

  const isOwner = currentUser?.id === targetProfile.id;

  // 2. Block check: If blocked by or has blocked the viewer, return not found
  if (currentUser && !isOwner) {
    const { data: block } = await supabase
      .from('blocks')
      .select('id')
      .or(`and(blocker_id.eq.${currentUser.id},blocked_id.eq.${targetProfile.id}),and(blocker_id.eq.${targetProfile.id},blocked_id.eq.${currentUser.id})`)
      .limit(1);

    if (block && block.length > 0) {
      notFound();
    }
  }

  // 3. Determine relationship and effective visibility
  let isConnected = false;
  let connectionStatus: 'none' | 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked' = 'none';
  let isIncoming = false;

  if (currentUser && !isOwner) {
    const low = currentUser.id < targetProfile.id ? currentUser.id : targetProfile.id;
    const high = currentUser.id < targetProfile.id ? targetProfile.id : currentUser.id;

    const { data: conn } = await supabase
      .from('connections')
      .select('*')
      .eq('user_low', low)
      .eq('user_high', high)
      .single();

    if (conn) {
      connectionStatus = conn.status;
      isConnected = conn.status === 'accepted';
      isIncoming = conn.requested_by === targetProfile.id && conn.status === 'pending';
    }
  }

  const sharesCampus =
    currentUser &&
    targetProfile.campus_id &&
    currentUser.user_metadata?.campus_id === targetProfile.campus_id;

  // 4. Enforce profile visibility
  const visibility = targetProfile.profile_visibility || 'public';
  if (!isOwner && !isPreviewMode) {
    if (visibility === 'only_me') {
      notFound();
    }
    if (visibility === 'connections' && !isConnected) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bento-card p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Connections-Only Profile
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              {targetProfile.display_name} has restricted their profile to verified connections only.
            </p>
            {currentUser ? (
              <ProfileActions
                profileId={targetProfile.id}
                initialStatus={connectionStatus}
                isIncoming={isIncoming}
              />
            ) : (
              <Link
                href={`/sign-in?redirect=/u/${username}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-xs font-semibold"
              >
                Sign In to Connect
              </Link>
            )}
          </div>
        </div>
      );
    }
    if (visibility === 'campus' && !sharesCampus) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bento-card p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center">
              <Building className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Campus-Restricted Profile
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              This portfolio is only visible to verified members of {targetProfile.institution?.name || 'their campus'}.
            </p>
          </div>
        </div>
      );
    }
  }

  // 5. Fetch works based on viewer authorization
  const profileWorks = await getWorksForProfile(targetProfile);
  const visibleWorks = profileWorks.filter((w) => {
    if (isOwner && !isPreviewMode) return true;
    if (w.visibility === 'only_me') return false;
    if (w.visibility === 'connections') return isConnected;
    if (w.visibility === 'campus') return sharesCampus;
    return w.visibility === 'public' || w.visibility === 'worldwide';
  });

  // 6. Fetch user skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('*, skill:skills(name, category)')
    .eq('user_id', targetProfile.id);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Mode Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Showcase</span>
          </Link>

          {isOwner && (
            <div className="inline-flex items-center gap-2 p-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-raised)] border border-[var(--border)] text-xs">
              <span className="text-[var(--text-secondary)] px-2">
                {isPreviewMode ? 'Public Preview Mode' : 'Viewing Your Profile'}
              </span>
              <Link
                href={isPreviewMode ? `/u/${username}` : `/u/${username}?preview=public`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isPreviewMode ? 'Exit Preview' : 'Preview as Public'}</span>
              </Link>
              <Link
                href="/profile/edit"
                className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bento-card p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Avatar & Identification */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative shrink-0">
                {targetProfile.avatar_url || targetProfile.avatar_path ? (
                  <img
                    src={targetProfile.avatar_url || targetProfile.avatar_path || undefined}
                    alt={targetProfile.display_name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-md)] object-cover border border-[var(--border)]"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)] font-bold text-2xl flex items-center justify-center">
                    {targetProfile.display_name ? targetProfile.display_name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                )}

                {targetProfile.is_campus_verified || targetProfile.is_verified ? (
                  <span
                    title="Verified University Domain"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center border-2 border-[var(--surface)]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                    {targetProfile.display_name}
                  </h1>

                  {/* Campus Verification Badge vs Self-Declared */}
                  {targetProfile.is_campus_verified || targetProfile.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      Verified Campus
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] text-[var(--text-muted)] border border-[var(--border)]">
                      Self-Declared
                    </span>
                  )}

                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border)]">
                    {targetProfile.role === 'faculty'
                      ? 'Faculty Mentor'
                      : targetProfile.role === 'recruiter'
                      ? 'Tech Recruiter'
                      : targetProfile.role === 'admin'
                      ? 'Admin'
                      : 'Student Builder'}
                  </span>
                </div>

                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  {targetProfile.headline || targetProfile.field || 'Student Scholar & Builder'}
                </p>

                {/* Institution and Location */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] pt-1">
                  {targetProfile.institution && (
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Building className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{targetProfile.institution.name}</span>
                    </span>
                  )}
                  {targetProfile.campus && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{targetProfile.campus.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions for Non-owners */}
            {!isOwner && !isPreviewMode && (
              <ProfileActions
                profileId={targetProfile.id}
                initialStatus={connectionStatus}
                isIncoming={isIncoming}
              />
            )}
          </div>

          {/* Bio Section */}
          {targetProfile.bio && (
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <h2 className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] tracking-wider">
                About & Research Background
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                {targetProfile.bio}
              </p>
            </div>
          )}

          {/* Skills Section with Evidence Links */}
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <h2 className="text-xs font-mono uppercase font-bold text-[var(--text-muted)] tracking-wider">
              Demonstrated Skills & Evidence
            </h2>

            {userSkills && userSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {userSkills.map((us: { id: string; proficiency?: string | null; endorsements_count?: number; skill?: { name: string; category?: string } | null }) => {
                  const sName = us.skill?.name || 'Skill';
                  const linkedWorks = visibleWorks
                    .filter((w) => w.description?.toLowerCase().includes(sName.toLowerCase()) || w.title?.toLowerCase().includes(sName.toLowerCase()))
                    .map((w) => ({ id: w.id, title: w.title }));

                  return (
                    <SkillEvidenceBadge
                      key={us.id}
                      userSkillId={us.id}
                      skillName={sName}
                      proficiency={us.proficiency}
                      endorsementsCount={us.endorsements_count || 0}
                      linkedWorks={linkedWorks}
                      canEndorse={isConnected && !isOwner}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">No skills published yet.</p>
            )}
          </div>
        </div>

        {/* Works, Certificates & Badges, and Achievements Feed */}
        <ProfileExperienceTabs
          profile={targetProfile}
          works={visibleWorks}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
