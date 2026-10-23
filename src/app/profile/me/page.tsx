export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/supabase/server';

export default async function MyProfilePage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in?redirect=/profile/me');
  }

  const profile = await getUserProfile();
  if (profile?.username) {
    redirect(`/u/${profile.username}`);
  } else if (profile?.id) {
    redirect(`/u/${profile.id}`);
  } else {
    redirect('/profile/edit');
  }
}
