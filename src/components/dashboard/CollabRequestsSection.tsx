'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  RotateCcw,
  Clock,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Inbox,
  Send,
  UserPlus,
} from 'lucide-react';
import {
  getSentRequests,
  getReceivedRequests,
  getAcceptedConnections,
  acceptConnectionRequest,
  declineConnectionRequest,
  revokeConnectionRequest,
  unfollowConnection,
  CONNECTIONS_EVENT,
  StoredConnectionItem,
} from '@/lib/connections/connection-store';

export default function CollabRequestsSection() {
  const [subTab, setSubTab] = useState<'received' | 'sent' | 'accepted'>('received');
  const [received, setReceived] = useState<StoredConnectionItem[]>([]);
  const [sent, setSent] = useState<StoredConnectionItem[]>([]);
  const [accepted, setAccepted] = useState<StoredConnectionItem[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refresh = () => {
    setReceived(getReceivedRequests());
    setSent(getSentRequests());
    setAccepted(getAcceptedConnections());
  };

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(CONNECTIONS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CONNECTIONS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleAccept = async (id: string) => {
    setActionLoading(`accept-${id}`);
    try {
      await acceptConnectionRequest(id);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    setActionLoading(`decline-${id}`);
    try {
      await declineConnectionRequest(id);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (id: string) => {
    setActionLoading(`revoke-${id}`);
    try {
      await revokeConnectionRequest(id);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnfollow = async (id: string) => {
    setActionLoading(`unfollow-${id}`);
    try {
      await unfollowConnection(id);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Subtab 1: Received */}
          <button
            onClick={() => setSubTab('received')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              subTab === 'received'
                ? 'bg-[#1b59f8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Received Requests</span>
            {received.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  subTab === 'received' ? 'bg-white text-blue-700 font-extrabold' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {received.length}
              </span>
            )}
          </button>

          {/* Subtab 2: Sent */}
          <button
            onClick={() => setSubTab('sent')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              subTab === 'sent'
                ? 'bg-[#1b59f8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent Requests</span>
            {sent.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  subTab === 'sent' ? 'bg-white text-blue-700 font-extrabold' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {sent.length}
              </span>
            )}
          </button>

          {/* Subtab 3: Accepted Collaborators */}
          <button
            onClick={() => setSubTab('accepted')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              subTab === 'accepted'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Collaborators</span>
            {accepted.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  subTab === 'accepted' ? 'bg-white text-emerald-800 font-extrabold' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {accepted.length}
              </span>
            )}
          </button>
        </div>

        <Link
          href="/people"
          className="text-xs font-semibold text-[#1b59f8] hover:underline flex items-center gap-1"
        >
          <span>Find more peers</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* ── SUBTAB 1: RECEIVED REQUESTS ── */}
      {subTab === 'received' && (
        <div>
          {received.length === 0 ? (
            <div className="py-10 px-6 rounded-2xl bg-[#f8fafc] border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b59f8] flex items-center justify-center mx-auto">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No incoming collab requests</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When student builders or tech recruiters send you collaboration invitations, they will appear right here for your approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {received.map((req) => (
                <div
                  key={req.targetUserId}
                  className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        req.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={req.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <Link
                          href={`/profile/${req.targetUserId}`}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 truncate"
                        >
                          {req.name}
                        </Link>
                        {req.role && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold shrink-0">
                            {req.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {req.headline || 'Campus Skill Connect Member'}
                      </p>
                      {req.institution && (
                        <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                          {req.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Pending approval</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(req.targetUserId)}
                        disabled={actionLoading === `accept-${req.targetUserId}`}
                        className="px-3.5 py-1.5 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleDecline(req.targetUserId)}
                        disabled={actionLoading === `decline-${req.targetUserId}`}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition-all active:scale-95"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SUBTAB 2: SENT REQUESTS ── */}
      {subTab === 'sent' && (
        <div>
          {sent.length === 0 ? (
            <div className="py-10 px-6 rounded-2xl bg-[#f8fafc] border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No pending sent requests</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t sent any collaboration requests yet. Explore the campus talent directory to connect with builders and recruiters.
              </p>
              <Link
                href="/people"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] hover:bg-[#1b59f8] text-white text-xs font-bold transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Explore Talent Directory</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sent.map((req) => (
                <div
                  key={req.targetUserId}
                  className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        req.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={req.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <Link
                          href={`/profile/${req.targetUserId}`}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 truncate"
                        >
                          {req.name}
                        </Link>
                        {req.role && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold shrink-0">
                            {req.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {req.headline || 'Campus Skill Connect Member'}
                      </p>
                      {req.institution && (
                        <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                          {req.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>Request Sent</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Revoke button */}
                      <button
                        onClick={() => handleRevoke(req.targetUserId)}
                        disabled={actionLoading === `revoke-${req.targetUserId}`}
                        className="px-3 py-1 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                        title="Revoke and cancel this sent request"
                      >
                        <RotateCcw className="w-3 h-3 text-rose-500" />
                        <span>Revoke Request</span>
                      </button>

                      {/* Simulator for test review */}
                      <button
                        onClick={() => handleAccept(req.targetUserId)}
                        className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-mono font-bold transition-all flex items-center gap-1"
                        title="Simulate recipient approving your request"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>Simulate Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SUBTAB 3: ACCEPTED COLLABORATORS ── */}
      {subTab === 'accepted' && (
        <div>
          {accepted.length === 0 ? (
            <div className="py-10 px-6 rounded-2xl bg-[#f8fafc] border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No active collaborators yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once requests are accepted by either party, your verified collaborators will be listed here with direct chat capability.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accepted.map((conn) => (
                <div
                  key={conn.targetUserId}
                  className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        conn.avatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={conn.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <Link
                          href={`/profile/${conn.targetUserId}`}
                          className="font-bold text-sm text-slate-900 hover:text-emerald-700 truncate"
                        >
                          {conn.name}
                        </Link>
                        {conn.role && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                            {conn.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {conn.headline || 'Verified Campus Collaborator'}
                      </p>
                      {conn.institution && (
                        <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                          {conn.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Connected</span>
                    </span>

                    {/* Chat button directly adjacent to Unfollow button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUnfollow(conn.targetUserId)}
                        disabled={actionLoading === `unfollow-${conn.targetUserId}`}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold transition-all active:scale-95"
                        title="Unfollow and disconnect collaborator"
                      >
                        Unfollow
                      </button>

                      <Link
                        href={`/messages?recipientId=${encodeURIComponent(conn.targetUserId)}`}
                        className="px-3.5 py-1.5 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
                        title={`Chat with ${conn.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
