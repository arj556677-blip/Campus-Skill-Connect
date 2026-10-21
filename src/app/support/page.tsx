export const dynamic = 'force-dynamic';

import React from 'react';
import { getSupportTickets } from '@/lib/data/service';
import SupportClient from './SupportClient';

export const metadata = {
  title: 'Support Helpdesk & Tickets — Campus Skill Connect',
  description: 'Submit technical inquiries, report account or privacy issues, and request campus whitelisting.',
};

export default async function SupportPage() {
  const tickets = await getSupportTickets();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SupportClient initialTickets={tickets} />
      </div>
    </div>
  );
}
