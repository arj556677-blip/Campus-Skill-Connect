export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

export default function MyProfilePage() {
  redirect('/profile/user-1');
}
