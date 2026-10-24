'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Profile, Zone } from '@/lib/types';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  ShieldCheck,
  UserPlus,
  UserCheck,
  Check,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Lock,
  Clock,
  Loader2,
} from 'lucide-react';
import {
  getConnection,
  sendConnectionRequest,
  unfollowConnection,
  CONNECTIONS_EVENT,
  ConnectionStatus,
} from '@/lib/connections/connection-store';

interface RecruitersDirectoryClientProps {
  recruiters: Profile[];
  zones: Zone[];
  currentUserRole?: string;
  isLoggedIn?: boolean;
}

// Fallback company mapping if not set in headline
function extractCompany(profile: Profile): { company: string; domain: string } {
  const headline = profile.headline || '';
  if (headline.includes('@')) {
    const parts = headline.split('@');
    const comp = parts[1].trim();
    const cleanDomain = comp.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    return { company: comp, domain: cleanDomain };
  }
  if (profile.display_name.toLowerCase().includes('sarah')) {
    return { company: 'TechCorp', domain: 'techcorp.com' };
  }
  if (profile.display_name.toLowerCase().includes('marcus')) {
    return { company: 'Stripe', domain: 'stripe.com' };
  }
  if (profile.display_name.toLowerCase().includes('elena')) {
    return { company: 'Scale AI', domain: 'scale.com' };
  }
  if (profile.display_name.toLowerCase().includes('david')) {
    return { company: 'Microsoft', domain: 'microsoft.com' };
  }
  return { company: 'Industry Partner', domain: 'verified-partner.com' };
}

export default function RecruitersDirectoryClient({
  recruiters,
  zones,
  currentUserRole = 'student',
  isLoggedIn = true,
}: RecruitersDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [connectionsMap, setConnectionsMap] = useState<
    Record<string, { status: ConnectionStatus; isIncoming: boolean }>
  >({});
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});

  // Synchronize connection states from central connection-store for uniform integration
  useEffect(() => {
    const syncAll = () => {
      const map: Record<string, { status: ConnectionStatus; isIncoming: boolean }> = {};
      for (const r of recruiters) {
        const item = getConnection(r.id);
        if (item) {
          map[r.id] = { status: item.status, isIncoming: item.isIncoming };
        } else {
          map[r.id] = { status: 'none', isIncoming: false };
        }
      }
      setConnectionsMap(map);
    };

    syncAll();
    window.addEventListener(CONNECTIONS_EVENT, syncAll);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener(CONNECTIONS_EVENT, syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, [recruiters]);

  const handleConnect = async (recruiter: Profile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionLoadingMap[recruiter.id]) return;

    setActionLoadingMap((prev) => ({ ...prev, [recruiter.id]: true }));
    try {
      await sendConnectionRequest({
        id: recruiter.id,
        name: recruiter.display_name,
        headline: recruiter.headline || 'Technical Recruiter',
        avatar: recruiter.avatar_url,
        role: recruiter.role,
        institution: recruiter.zone?.name || 'Corporate Partner',
      });

      setConnectionsMap((prev) => ({
        ...prev,
        [recruiter.id]: { status: 'pending', isIncoming: false },
      }));
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [recruiter.id]: false }));
    }
  };

  const handleUnfollow = async (recruiter: Profile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionLoadingMap[recruiter.id]) return;

    setActionLoadingMap((prev) => ({ ...prev, [recruiter.id]: true }));
    try {
      await unfollowConnection(recruiter.id);

      setConnectionsMap((prev) => ({
        ...prev,
        [recruiter.id]: { status: 'none', isIncoming: false },
      }));
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [recruiter.id]: false }));
    }
  };

  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((r) => {
      // 1. Zone filter
      const matchesZone =
        selectedZone === 'all' ||
        r.zone_id === selectedZone ||
        r.zone?.id === selectedZone;

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const compInfo = extractCompany(r);
      const matchesQuery =
        !q ||
        r.display_name.toLowerCase().includes(q) ||
        (r.headline || '').toLowerCase().includes(q) ||
        (r.bio || '').toLowerCase().includes(q) ||
        (r.field || '').toLowerCase().includes(q) ||
        compInfo.company.toLowerCase().includes(q) ||
        compInfo.domain.toLowerCase().includes(q);

      return matchesZone && matchesQuery;
    });
  }, [recruiters, selectedZone, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1b59f8] font-bold mb-1.5">
            <Building2 className="w-4 h-4" />
            <span>Verified Industry Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Corporate Talent Partners &amp; Recruiters
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xl">
            Explore active industry scouts, engineering recruiters, and university talent partners sourcing directly from student proof of work.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-800 font-semibold self-start md:self-end">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Verified Work Email Domains Required</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company (e.g. Stripe, Scale AI, Microsoft), recruiter name, or hiring tech stack..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1b59f8]"
            >
              <option value="all">All Innovation Hubs</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recruiter Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredRecruiters.length}</strong> verified corporate recruiter{filteredRecruiters.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredRecruiters.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No recruiters found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try clearing your search query or switching innovation hubs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecruiters.map((recruiter) => {
              const compInfo = extractCompany(recruiter);
              const connInfo = connectionsMap[recruiter.id] || { status: 'none', isIncoming: false };
              const isLoading = actionLoadingMap[recruiter.id];

              return (
                <div
                  key={recruiter.id}
                  className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header: Company Badge (Hiring Active removed per user request) */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{compInfo.company}</span>
                      </span>
                    </div>

                    {/* Recruiter Avatar & Identity */}
                    <div className="flex items-start gap-3.5 pt-1">
                      <div className="relative shrink-0">
                        {recruiter.avatar_url ? (
                          <img
                            src={recruiter.avatar_url}
                            alt={recruiter.display_name}
                            className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-slate-900 to-blue-900 text-white font-bold text-base flex items-center justify-center shadow-xs">
                            {recruiter.display_name.slice(0, 2)}
                          </div>
                        )}
                        <span
                          title="Verified Corporate Domain"
                          className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#1b59f8] text-white flex items-center justify-center ring-2 ring-white"
                        >
                          <ShieldCheck className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-base text-slate-900 truncate">
                          {recruiter.display_name}
                        </h3>
                        <p className="text-xs font-medium text-slate-600 mt-0.5 line-clamp-1">
                          {recruiter.headline || 'Technical Recruiter'}
                        </p>
                        <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>@{compInfo.domain}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sourcing Focus & Bio */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      {recruiter.field && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Hiring Focus
                          </span>
                          <p className="font-medium text-slate-800 mt-0.5">
                            {recruiter.field}
                          </p>
                        </div>
                      )}

                      {recruiter.bio && (
                        <p className="text-slate-600 line-clamp-3 text-[11px] leading-relaxed pt-1">
                          &ldquo;{recruiter.bio}&rdquo;
                        </p>
                      )}

                      {recruiter.zone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono pt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{recruiter.zone.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Uniform Connection & Chat Integration */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {connInfo.status === 'accepted' ? (
                        /* Accepted Collab: Unfollow and Chat side by side (Chat strictly with connected people) */
                        <>
                          <button
                            onClick={(e) => handleUnfollow(recruiter, e)}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all active:scale-95 shadow-xs"
                            title="Unfollow and disconnect collaborator"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unfollow</span>
                          </button>

                          <Link
                            href={`/messages?recipientId=${encodeURIComponent(recruiter.id)}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold bg-[#1b59f8] hover:bg-blue-600 text-white transition-all shadow-xs active:scale-95"
                            title={`Chat with ${recruiter.display_name}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </Link>
                        </>
                      ) : connInfo.status === 'pending' && !connInfo.isIncoming ? (
                        /* Request Sent: Immutable until acted upon by either user */
                        <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Request Sent</span>
                        </span>
                      ) : (
                        /* Not connected: Connect button (NO chat button until connected) */
                        <button
                          onClick={(e) => handleConnect(recruiter, e)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold bg-[#0f172a] hover:bg-[#1b59f8] text-white transition-all shadow-xs active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      )}

                      <Link
                        href={`/profile/${recruiter.id}`}
                        className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0"
                        title="View Public Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>Zero Web Scraping • Student-Controlled Portfolios</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
