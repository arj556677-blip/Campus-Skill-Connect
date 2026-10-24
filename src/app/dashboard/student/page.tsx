export const dynamic = 'force-dynamic';

import { getWorks, getProfiles } from '@/lib/data/service';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import StudentDashboardClient from './StudentDashboardClient';

export const metadata = {
  title: 'Student Command Center — Campus Skill Connect',
  description: 'Manage your verified proof of work, ATS resume readiness, recruiter inquiries, and active collaboration sprints.',
};

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const works = await getWorks();
  const profiles = await getProfiles();

  let studentProfile = null;
  if (user) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
      .eq('id', user.id)
      .single();
    studentProfile = prof;
  }

  // Filter works owned by authenticated student, or show all if demo
  const myWorks = user 
    ? works.filter((w) => w.owner_id === user.id)
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentDashboardClient
          myWorks={myWorks}
          profiles={profiles}
          userId={user?.id}
          studentProfile={studentProfile}
        />
      </div>
    </div>
  );
}
