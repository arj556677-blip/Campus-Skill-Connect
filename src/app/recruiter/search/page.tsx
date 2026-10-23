export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { getProfiles, getCommunities, getZones } from '@/lib/data/service';
import RecruiterClient from './RecruiterClient';
import { ShieldAlert, Briefcase, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Recruiter Search — Campus Skill Connect',
  description: 'Source verified student scholars and builders based on published proof of work.',
};

export default async function RecruiterSearchPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in?redirect=/recruiter/search');
  }

  const profile = await getUserProfile();
  const isRecruiterOrAdmin = profile?.role === 'recruiter' || profile?.role === 'admin';

  if (!isRecruiterOrAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bento-card p-8 text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Recruiter Verification Required
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Candidate search is restricted to verified industry recruiters with a confirmed company work email domain.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-xs font-semibold"
            >
              Register Corporate Recruiter Account
            </Link>
            <Link
              href="/showcase"
              className="text-xs text-[var(--text-secondary)] hover:text-white"
            >
              Return to Public Showcase
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch only public and campus profiles (excluding only_me and connections-only)
  const allProfiles = await getProfiles();
  const allowedProfiles = allProfiles.filter(
    (p) => p.profile_visibility === 'public' || p.profile_visibility === 'worldwide'
  );

  const communities = await getCommunities();
  const zones = await getZones();

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecruiterClient
          profiles={allowedProfiles}
          communities={communities}
          zones={zones}
        />
      </div>
    </div>
  );
}
