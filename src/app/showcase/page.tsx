export const dynamic = 'force-dynamic';

import React from 'react';
import { getWorks } from '@/lib/data/service';
import ShowcaseClient from './ShowcaseClient';

export const metadata = {
  title: 'Work Showcase — Campus Skill Connect',
  description: 'Explore verified student software, research papers, design portfolios, and creative works.',
};

export default async function ShowcasePage() {
  const initialWorks = await getWorks();

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShowcaseClient initialWorks={initialWorks} />
      </div>
    </div>
  );
}
