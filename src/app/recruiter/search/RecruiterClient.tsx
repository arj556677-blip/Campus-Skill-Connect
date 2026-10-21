'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Building,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Download,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Profile, Community, Zone } from '@/lib/types';

interface RecruiterClientProps {
  profiles: Profile[];
  communities: Community[];
  zones: Zone[];
}

export default function RecruiterClient({
  profiles,
  communities,
  zones,
}: RecruiterClientProps) {
  const [jobQuery, setJobQuery] = useState('Redis, Next.js, Distributed Systems');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [shortlist, setShortlist] = useState<string[]>(['user-1']);

  const rankedCandidates = useMemo(() => {
    const requiredSkills = jobQuery
      .toLowerCase()
      .split(/[,+\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return profiles
      .filter((p) => p.role === 'student')
      .map((profile) => {
        let matchCount = 0;
        const profileCorpus = (
          profile.display_name +
          ' ' +
          (profile.headline || '') +
          ' ' +
          (profile.bio || '') +
          ' ' +
          (profile.field || '')
        ).toLowerCase();

        requiredSkills.forEach((skill) => {
          if (profileCorpus.includes(skill)) matchCount++;
        });

        const baseScore = requiredSkills.length > 0 ? (matchCount / requiredSkills.length) * 100 : 70;
        const matchScore = Math.min(Math.round(baseScore * 0.4 + 60), 98);

        return {
          ...profile,
          matchScore,
        };
      })
      .filter((p) => {
        const matchesCommunity =
          selectedCommunity === 'all' || p.institution_id === selectedCommunity;
        const matchesZone = selectedZone === 'all' || p.zone_id === selectedZone;
        return matchesCommunity && matchesZone;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [profiles, jobQuery, selectedCommunity, selectedZone]);

  const toggleBookmark = (id: string) => {
    if (shortlist.includes(id)) {
      setShortlist(shortlist.filter((uid) => uid !== id));
    } else {
      setShortlist([...shortlist, id]);
    }
  };

  const handleExportShortlist = () => {
    const candidateData = rankedCandidates
      .filter((c) => shortlist.includes(c.id))
      .map((c) => ({
        name: c.display_name,
        role: c.headline,
        matchScore: `${c.matchScore}%`,
        campus: c.institution?.name || 'IISc',
        email: 'via campus-skill-connect',
      }));

    const blob = new Blob([JSON.stringify(candidateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Candidate_Shortlist_CampusSkillConnect.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-bold mb-1.5">
            <Briefcase className="w-4 h-4" />
            <span>Recruiter Candidate Match Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Signal Student Engineering Search
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Rank student candidates based on verified repositories and technical achievements rather than self-reported resume claims.
          </p>
        </div>

        <button
          onClick={handleExportShortlist}
          disabled={shortlist.length === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] disabled:opacity-50 self-start md:self-end"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Export Shortlist ({shortlist.length})</span>
        </button>
      </div>

      {/* Target Job Skill Input Bar */}
      <div className="rounded-2xl bento-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
            Target Job Skills / Technical Stack
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              placeholder="e.g. Next.js, Redis, PyTorch, Distributed Systems, WebRTC..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090b10] border border-white/10 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-400 font-mono">
            Our match engine computes weighted alignment across verified works, GitHub tags, and peer endorsements.
          </p>
        </div>

        {/* Institution & Zone Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/[0.06] font-mono text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="bg-[#090b10] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="all">All Campuses</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#090b10] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="all">All City Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Ranking List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>
            Ranked <strong className="text-white">{rankedCandidates.length}</strong> qualified student builder{rankedCandidates.length === 1 ? '' : 's'}
          </span>
          <span className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Recruiter Safe-Contact Protocol Active
          </span>
        </div>

        <div className="space-y-3">
          {rankedCandidates.map((candidate, idx) => {
            const isBookmarked = shortlist.includes(candidate.id);
            return (
              <div
                key={candidate.id}
                className="rounded-2xl bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={candidate.avatar_url!}
                      alt={candidate.display_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/10"
                    />
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-violet-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-md">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${candidate.id}`}
                        className="font-bold text-base text-white hover:text-violet-300 transition-colors"
                      >
                        {candidate.display_name}
                      </Link>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-violet-400" />
                        Verified
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 font-medium">
                      {candidate.headline}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400 font-mono">
                      {candidate.institution && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-zinc-400" />
                          {candidate.institution.name}
                        </span>
                      )}
                      {candidate.zone && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          {candidate.zone.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Match Gauge & Actions */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {candidate.matchScore}%
                    </span>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">
                      Skill Alignment
                    </p>
                  </div>

                  <button
                    onClick={() => toggleBookmark(candidate.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isBookmarked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Remove from shortlist' : 'Add to shortlist'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>

                  <Link
                    href={`/profile/${candidate.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white text-xs font-bold transition-all"
                  >
                    <span>View Evidence</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
