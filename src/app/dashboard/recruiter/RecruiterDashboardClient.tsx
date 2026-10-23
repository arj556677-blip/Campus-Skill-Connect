'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRole, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  Briefcase,
  Search,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Video,
  UserCog,
} from 'lucide-react';
import { Profile, Community, Zone } from '@/lib/types';

interface RecruiterDashboardClientProps {
  profiles: Profile[];
  communities: Community[];
  zones: Zone[];
}

export default function RecruiterDashboardClient({
  profiles,
  communities,
}: RecruiterDashboardClientProps) {
  const { currentUser: authUser } = useRole();
  const currentUser = authUser || ROLE_PERSONAS.recruiter;
  const [shortlist, setShortlist] = useState<string[]>(['user-1', 'user-2']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('all');

  const toggleShortlist = (id: string) => {
    setShortlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const studentCandidates = useMemo(() => {
    return profiles.filter((p) => p.role === 'student');
  }, [profiles]);

  const filteredCandidates = useMemo(() => {
    return studentCandidates.filter((p) => {
      if (selectedCommunity !== 'all' && p.institution_id !== selectedCommunity) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${p.display_name} ${p.headline || ''} ${p.field || ''}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [studentCandidates, selectedCommunity, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Soft subtle glow wash */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Tech Recruiter
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Stripe &amp; Scale AI Campus Partnerships
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recruiter Command Hub • {currentUser.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                Source pre-verified student engineers directly through authentic code proofs, GitHub commits, and zero-fluff ATS resumes.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/recruiter/search"
              className="px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Full Candidate Radar</span>
            </Link>

            <Link
              href="/collaborate"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Live Interview Rooms</span>
            </Link>

            <Link
              href="/messages"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#1b59f8]" />
              <span>Candidate Chats</span>
            </Link>

            <Link
              href="/profile/edit"
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <UserCog className="w-4 h-4 text-emerald-600" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Hiring Pipeline Funnel Stats */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Sourced Candidates</p>
              <p className="text-xs font-bold text-slate-800">48 Verified Profiles</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b59f8] animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Proofs Inspected</p>
              <p className="text-xs font-bold text-slate-800">24 Technical Repos</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Interviews Active</p>
              <p className="text-xs font-bold text-slate-800">7 Scheduled Sprints</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Offers Extended</p>
              <p className="text-xs font-bold text-slate-800">3 High-Signal Offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 1: ACTIVE OPENINGS & SHORTLIST METRICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTIVE OPENINGS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Active Campus Requisitions</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                2 OPEN
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    Distributed Systems Engineer (New Grad)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    Filter Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Core Infrastructure • Distributed Systems, Rust, Raft
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Candidate Search Criteria</span>
                  <span className="text-[#1b59f8] font-bold">Skill Match</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    Full-Stack Web Architect (Campus)
                  </h4>
                  <span className="text-[10px] font-mono text-[#1b59f8] font-bold">
                    Filter Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Web Applications • Full-Stack Systems, TypeScript, Relational Data
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Candidate Search Criteria</span>
                  <span className="text-[#1b59f8] font-bold">Campus Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/recruiter/search"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <span>Tune Skill Filters in Search Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SHORTLIST PREVIEW & FAST CONTACT (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Your Starred Candidates ({shortlist.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Direct Contact Whitelisted
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studentCandidates
                .filter((c) => shortlist.includes(c.id))
                .map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={candidate.avatar_url || ''}
                            alt={candidate.display_name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{candidate.display_name}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                              {candidate.institution?.name || 'IISc Bangalore'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          VERIFIED
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {candidate.headline || candidate.bio}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <Link
                        href={`/profile/${candidate.id}`}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                      >
                        <span>Inspect Proofs</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <Link
                        href="/messages"
                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat</span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>All candidates verified with institutional email domains (.edu, .ac.in).</span>
            <span className="text-emerald-700 font-mono font-bold">Zero Plagiarism Verified</span>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 2: VERIFIED CANDIDATE RADAR TABLE ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Campus Verified Builder Directory</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Filter by campus institution or skills to discover authentic student builders
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill or keyword..."
                className="pl-8 pr-3 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1b59f8]"
              />
            </div>

            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Universities</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Student Builder</th>
                <th className="py-2.5 px-3">University Campus</th>
                <th className="py-2.5 px-3">Primary Focus &amp; Stack</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Proof Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => {
                const isShortlisted = shortlist.includes(candidate.id);
                return (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.avatar_url || ''}
                          alt={candidate.display_name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{candidate.display_name}</p>
                          <p className="text-[11px] text-slate-500">{candidate.field || 'Computer Science'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-mono">
                      {candidate.institution?.name || 'IISc Bangalore'}
                    </td>

                    <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                      {candidate.headline || candidate.bio}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono text-[10px]">
                        ACTIVE
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleShortlist(candidate.id)}
                          className={`p-1.5 rounded-full border transition-all ${
                            isShortlisted
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                          title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <Link
                          href={`/profile/${candidate.id}`}
                          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <span>Proofs</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <Link
                          href="/messages"
                          className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Outreach</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
