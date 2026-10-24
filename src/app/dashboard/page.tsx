export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { getWorks, getCommunities, getProfiles } from '@/lib/data/service';
import GeneralDashboardClient from './GeneralDashboardClient';

export const metadata = {
  title: 'Unified Platform Dashboard — Campus Skill Connect',
  description: 'General platform operations, campus statistics, and gateways to specialized Admin, Student, and Recruiter dashboards.',
};

export default async function DashboardPage() {
  const user = await getUser();
  const profile = await getUserProfile();

  if (profile?.role === 'student' || profile?.role === 'faculty') {
    redirect('/dashboard/student');
  } else if (profile?.role === 'recruiter') {
    redirect('/dashboard/recruiter');
  } else if (profile?.role === 'admin') {
    redirect('/admin');
  } else if (user) {
    redirect('/dashboard/student');
  }
  const works = await getWorks();
  const communities = await getCommunities();
  const profiles = await getProfiles();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
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
