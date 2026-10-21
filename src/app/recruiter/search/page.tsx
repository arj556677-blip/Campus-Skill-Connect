export const dynamic = 'force-dynamic';

import React from 'react';
import { getProfiles, getCommunities, getZones } from '@/lib/data/service';
import RecruiterClient from './RecruiterClient';

export const metadata = {
  title: 'Recruiter Talent Hub & Match Engine — Campus Skill Connect',
  description: 'Source verified student engineers and researchers based on production proof of work and skill match scores.',
};

export default async function RecruiterSearchPage() {
  const profiles = await getProfiles();
  const communities = await getCommunities();
  const zones = await getZones();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecruiterClient
          profiles={profiles}
          communities={communities}
          zones={zones}
        />
      </div>
    </div>
  );
}
