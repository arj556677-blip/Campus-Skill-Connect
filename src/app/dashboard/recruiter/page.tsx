export const dynamic = 'force-dynamic';

import React from 'react';
import { getProfiles, getCommunities, getZones } from '@/lib/data/service';
import RecruiterDashboardClient from './RecruiterDashboardClient';

export const metadata = {
  title: 'Recruiter Talent Pipeline & Sourcing Hub — Campus Skill Connect',
  description: 'Manage candidate pipelines, inspect verified proof of work, and recruit high-signal campus engineers.',
};

export default async function RecruiterDashboardPage() {
  const profiles = await getProfiles();
  const communities = await getCommunities();
  const zones = await getZones();

  return (
    <div className="min-h-screen bg-[#08090d] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecruiterDashboardClient
          profiles={profiles}
          communities={communities}
          zones={zones}
        />
      </div>
    </div>
  );
}
