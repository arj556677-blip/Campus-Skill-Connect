export const dynamic = 'force-dynamic';

import React from 'react';
import { getAuditLogs, getCommunities, getProfiles, getWorks } from '@/lib/data/service';
import { MOCK_REPORTS } from '@/lib/data/mock-data';
import AdminClient from './AdminClient';

export const metadata = {
  title: 'Platform Administration & Security Center — Campus Skill Connect',
  description: 'Enterprise moderation queue, campus domain federation, recruiter governance, and zero-trust security audit logs.',
};

export default async function AdminPage() {
  const auditLogs = await getAuditLogs();
  const communities = await getCommunities();
  const profiles = await getProfiles();
  const works = await getWorks();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminClient
          auditLogs={auditLogs}
          communities={communities}
          reports={MOCK_REPORTS}
          profiles={profiles}
          works={works}
        />
      </div>
    </div>
  );
}
