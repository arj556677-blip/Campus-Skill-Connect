export const dynamic = 'force-dynamic';

import React from 'react';
import { getWorks, getCommunities, getProfiles } from '@/lib/data/service';
import GeneralDashboardClient from './GeneralDashboardClient';

export const metadata = {
  title: 'Unified Platform Dashboard — Campus Skill Connect',
  description: 'General platform operations, campus statistics, and gateways to specialized Admin, Student, and Recruiter dashboards.',
};

export default async function DashboardPage() {
  const works = await getWorks();
  const communities = await getCommunities();
  const profiles = await getProfiles();

  return (
    <div className="min-h-screen bg-[#08090d] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GeneralDashboardClient
          works={works}
          communities={communities}
          profiles={profiles}
        />
      </div>
    </div>
  );
}
