import React, { Suspense } from 'react';
import MessagesClient from './MessagesClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Direct Messages — Campus Skill Connect',
  description: 'Real-time secure peer-to-peer student & mentor communication.',
};

export default function MessagesPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f8fafc] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-140px)]">
        <Suspense
          fallback={
            <div className="h-[500px] flex items-center justify-center bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-[#1b59f8] animate-spin" />
            </div>
          }
        >
          <MessagesClient />
        </Suspense>
      </div>
    </div>
  );
}
