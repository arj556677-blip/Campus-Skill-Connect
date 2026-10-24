'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import CollabRequestsSection from '@/components/dashboard/CollabRequestsSection';

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1b59f8] font-bold mb-1.5">
              <Users className="w-4 h-4" />
              <span>Consent-Based Academic Networking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Collaborations &amp; Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              You maintain 100% control over who sees your verified contact details and message inbox.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-800 font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Strict Double-Opt-In Messaging</span>
          </div>
        </div>

        {/* Central Collab Requests Section */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <CollabRequestsSection />
        </div>
      </div>
    </div>
  );
}
