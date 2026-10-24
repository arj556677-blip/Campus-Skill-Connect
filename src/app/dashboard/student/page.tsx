export const dynamic = 'force-dynamic';

import { getWorks, getProfiles } from '@/lib/data/service';
import { getUser } from '@/lib/supabase/server';
import StudentDashboardClient from './StudentDashboardClient';

export const metadata = {
  title: 'Student Command Center — Campus Skill Connect',
  description: 'Manage your verified proof of work, ATS resume readiness, recruiter inquiries, and active collaboration sprints.',
};

export default async function StudentDashboardPage() {
  const user = await getUser();

  const works = await getWorks();
  const profiles = await getProfiles();

  // Filter works owned by authenticated student, or show student portfolio
  const myWorks = user 
    ? works.filter((w) => w.owner_id === user.id || (user.user_metadata?.role === 'student' && (w.owner_id === 'user-1' || w.owner_id === 'user-student')))
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentDashboardClient myWorks={myWorks} profiles={profiles} />
      </div>
    </div>
  );
}
