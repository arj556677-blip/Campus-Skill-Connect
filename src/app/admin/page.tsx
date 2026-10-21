export const dynamic = 'force-dynamic';

import React from 'react';
import { getAuditLogs, getCommunities } from '@/lib/data/service';
import { MOCK_REPORTS } from '@/lib/data/mock-data';
import AdminClient from './AdminClient';

export const metadata = {
  title: 'Platform Administration & Moderation — Campus Skill Connect',
  description: 'Manage content safety, verify campus institutions, and inspect security audit logs.',
};

export default async function AdminPage() {
  const auditLogs = await getAuditLogs();
  const communities = await getCommunities();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminClient
          auditLogs={auditLogs}
          communities={communities}
          reports={MOCK_REPORTS}
        />
      </div>
    </div>
  );
}
