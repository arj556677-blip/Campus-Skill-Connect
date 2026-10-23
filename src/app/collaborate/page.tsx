export const dynamic = 'force-dynamic';

import React from 'react';
import { getCollabRooms } from '@/lib/data/service';
import CollaborateClient from './CollaborateClient';

export const metadata = {
  title: 'Collaboration Rooms & WebRTC — Campus Skill Connect',
  description: 'Instant video meeting and sprint rooms for student engineers, researchers, and creators.',
};

export default async function CollaboratePage() {
  const rooms = await getCollabRooms();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CollaborateClient initialRooms={rooms} />
      </div>
    </div>
  );
}
