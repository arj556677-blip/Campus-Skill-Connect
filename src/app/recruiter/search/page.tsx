export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { getProfiles, getCommunities, getZones } from '@/lib/data/service';
import RecruiterClient from './RecruiterClient';
import RecruitersDirectoryClient from './RecruitersDirectoryClient';
import { Users, Search, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Industry Recruiters & Talent Search — Campus Skill Connect',
  description: 'Connect with verified corporate recruiters and discover campus builders based on published proof of work.',
};

export default async function RecruiterSearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const user = await getUser();

  if (!user) {
    redirect('/sign-in?redirect=%2Frecruiter%2Fsearch');
  }

  const profile = await getUserProfile();
  const isRecruiterOrAdmin = profile?.role === 'recruiter' || profile?.role === 'admin';

  // 1. Fetch verified recruiters for directory view
  const recruiterProfiles = await getProfiles({ role: 'recruiter' });
  const zones = await getZones();
  const communities = await getCommunities();

  // If the user is NOT a recruiter or admin, display all recruiters with limited details
  if (!isRecruiterOrAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecruitersDirectoryClient
            recruiters={recruiterProfiles}
            zones={zones}
            currentUserRole={profile?.role || 'student'}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    );
  }

  // If the user IS a verified recruiter or platform admin:
  // Provide seamless tab navigation between candidate sourcing tool and the recruiter peer directory
  const mode = params?.mode || 'sourcing';

  // Fetch only public and campus profiles for candidate search
  const allProfiles = await getProfiles();
  const allowedProfiles = allProfiles.filter(
    (p) => p.profile_visibility === 'public' || p.profile_visibility === 'worldwide'
  );

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Recruiter / Admin Mode Switcher */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-semibold">
            <Link
              href="/recruiter/search?mode=sourcing"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                mode === 'sourcing'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Candidate Sourcing Tool</span>
            </Link>
            <Link
              href="/recruiter/search?mode=directory"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                mode === 'directory'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Browse Recruiter Directory</span>
            </Link>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Logged in as <strong className="text-slate-800">{profile?.display_name}</strong> (Verified Recruiter)
          </div>
        </div>

        {mode === 'directory' ? (
          <RecruitersDirectoryClient
            recruiters={recruiterProfiles}
            zones={zones}
            currentUserRole={profile?.role || 'recruiter'}
            isLoggedIn={true}
          />
        ) : (
          <RecruiterClient
            profiles={allowedProfiles}
            communities={communities}
            zones={zones}
          />
        )}
      </div>
    </div>
  );
}
