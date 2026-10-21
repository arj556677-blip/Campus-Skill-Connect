import React from 'react';
import MessagesClient from './MessagesClient';

export const metadata = {
  title: 'Direct Messages — Campus Skill Connect',
  description: 'Real-time in-app peer communication powered by Redis Pub/Sub.',
};

export default function MessagesPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-[var(--color-paper)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-140px)]">
        <MessagesClient />
      </div>
    </div>
  );
}
