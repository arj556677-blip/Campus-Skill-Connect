'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Check,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/data/mock-data';

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'connected'>('pending');

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      sender: MOCK_PROFILES[3], // Dr. Anita Sengupta (Faculty)
      note: 'Hello Alex, I was impressed by your HyperCache benchmarks. Would love to connect regarding our campus systems research group.',
      time: '2 hours ago',
    },
    {
      id: 'req-2',
      sender: MOCK_PROFILES[4], // Marcus Chen (Recruiter)
      note: 'Hi Alex! We are actively recruiting for distributed systems interns at Scale AI. Let us connect.',
      time: '1 day ago',
    },
  ]);

  const [activeConnections, setActiveConnections] = useState([
    MOCK_PROFILES[1], // Priya Sharma
    MOCK_PROFILES[2], // Karan Verma
  ]);

  const handleAccept = (reqId: string, sender: (typeof MOCK_PROFILES)[0]) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
    setActiveConnections([sender, ...activeConnections]);
  };

  const handleReject = (reqId: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-brand-primary)] font-bold mb-1">
              <Users className="w-4 h-4" />
              <span>Consent-Based Academic Networking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-ink)]">
              Manage Connections & Network
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mt-1">
              You maintain 100% control over who sees your contact details and message inbox.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-[var(--color-border)] p-1 rounded-xl shadow-soft">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-[var(--color-ink)] text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span>Pending Requests</span>
              {pendingRequests.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'connected'
                  ? 'bg-[var(--color-ink)] text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Active Network ({activeConnections.length})
            </button>
          </div>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="rounded-3xl bg-white border border-dashed border-[var(--color-border)] p-12 text-center">
                <UserCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[var(--color-ink)]">All caught up!</h3>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                  You have no pending connection requests at the moment.
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl bg-white border border-[var(--color-border)] p-6 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={req.sender.avatar_url!}
                        alt={req.sender.display_name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-zinc-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profile/${req.sender.id}`}
                            className="font-bold text-sm text-[var(--color-ink)] hover:text-[var(--color-brand-primary)]"
                          >
                            {req.sender.display_name}
                          </Link>
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-700">
                            {req.sender.role}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-ink-muted)]">
                          {req.sender.headline}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-zinc-400 font-mono self-start sm:self-center">
                      {req.time}
                    </span>
                  </div>

                  {req.note && (
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-[var(--color-ink-muted)] leading-relaxed italic">
                      &ldquo;{req.note}&rdquo;
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.sender)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-brand-primary)] text-white text-xs font-bold shadow-soft hover:bg-[var(--color-brand-primary-hover)] transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Connection</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Active Connections Tab */}
        {activeTab === 'connected' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeConnections.map((person) => (
              <div
                key={person.id}
                className="rounded-3xl bg-white border border-[var(--color-border)] p-5 shadow-soft flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={person.avatar_url!}
                    alt={person.display_name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/profile/${person.id}`}
                      className="font-bold text-sm text-[var(--color-ink)] hover:text-[var(--color-brand-primary)] truncate block"
                    >
                      {person.display_name}
                    </Link>
                    <p className="text-xs text-[var(--color-ink-muted)] truncate">
                      {person.headline}
                    </p>
                  </div>
                </div>

                <Link
                  href="/messages"
                  className="p-2.5 rounded-xl bg-zinc-100 hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)] text-zinc-600 transition-colors shrink-0"
                  title="Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
