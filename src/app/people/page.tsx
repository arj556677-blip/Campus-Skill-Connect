export const dynamic = 'force-dynamic';

import React from 'react';
import { getProfiles, getCommunities, getZones } from '@/lib/data/service';
import PeopleClient from './PeopleClient';

export const metadata = {
  title: 'Campus Talent Directory — Campus Skill Connect',
  description: 'Discover verified student engineers, researchers, and creators across colleges and regional innovation zones.',
};

export default async function PeoplePage() {
  const profiles = await getProfiles();
  const communities = await getCommunities();
  const zones = await getZones();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PeopleClient
          initialProfiles={profiles}
          communities={communities}
          zones={zones}
        />
      </div>
    </div>
  );
}
