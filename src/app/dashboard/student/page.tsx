export const dynamic = 'force-dynamic';

import React from 'react';
import { getWorks, getProfiles } from '@/lib/data/service';
import StudentDashboardClient from './StudentDashboardClient';

export const metadata = {
  title: 'Student Command Center — Campus Skill Connect',
  description: 'Manage your verified proof of work, ATS resume readiness, recruiter inquiries, and active collaboration sprints.',
};

export default async function StudentDashboardPage() {
  const works = await getWorks();
  const profiles = await getProfiles();

  // Find Alex Rivera's works
  const myWorks = works.filter((w) => w.owner_id === 'user-1' || !w.owner_id);

  return (
    <div className="min-h-screen bg-[#08090d] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentDashboardClient myWorks={myWorks} profiles={profiles} />
      </div>
    </div>
  );
}
