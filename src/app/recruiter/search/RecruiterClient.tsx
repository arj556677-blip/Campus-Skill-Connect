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
  SlidersHorizontal,
  X,
  Users,
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
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [shortlist, setShortlist] = useState<string[]>([]);

  // Unique fields for filter dropdown
  const uniqueFields = useMemo(() => {
    const fields = new Set<string>();
    profiles.forEach((p) => {
      if (p.field) fields.add(p.field);
    });
    return Array.from(fields);
  }, [profiles]);

  const filteredCandidates = useMemo(() => {
    const searchTerms = skillFilter
      .toLowerCase()
      .split(/[,+\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return profiles
      .filter((p) => p.role === 'student')
      .filter((p) => {
        // Community filter
        if (selectedCommunity !== 'all' && p.institution_id !== selectedCommunity) {
          return false;
        }

        // Field filter
        if (selectedField !== 'all' && p.field !== selectedField) {
          return false;
        }

        // Skills & text filter
        if (searchTerms.length > 0) {
          const profileCorpus = (
            p.display_name +
            ' ' +
            (p.headline || '') +
            ' ' +
            (p.bio || '') +
            ' ' +
            (p.field || '')
          ).toLowerCase();

          const allMatched = searchTerms.every((term) => profileCorpus.includes(term));
          if (!allMatched) return false;
        }

        return true;
      });
  }, [profiles, skillFilter, selectedCommunity, selectedField]);

  const toggleBookmark = (id: string) => {
    if (shortlist.includes(id)) {
      setShortlist(shortlist.filter((uid) => uid !== id));
    } else {
      setShortlist([...shortlist, id]);
    }
  };

  const handleExportShortlist = () => {
    const candidateData = filteredCandidates
      .filter((c) => shortlist.includes(c.id))
      .map((c) => ({
        name: c.display_name,
        username: c.username || c.id,
        headline: c.headline || 'Scholar',
        campus: c.institution?.name || 'Verified University',
        field: c.field || 'General',
        profile_url: `/u/${c.username || c.id}`,
      }));

    const blob = new Blob([JSON.stringify(candidateData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Candidate_Shortlist.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Verified Talent Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Corporate Candidate Search
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
            Compare student engineers and scholars directly on verifiable production work, academic discipline, and institutional membership.
          </p>
        </div>

        {shortlist.length > 0 && (
          <button
            onClick={handleExportShortlist}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export Shortlist ({shortlist.length})</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skill Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Filter by skills or keyword..."
            className="w-full pl-9 pr-8 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
          />
          {skillFilter && (
            <button
              onClick={() => setSkillFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Campus Filter */}
        <div>
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--focus)]"
          >
            <option value="all">All Campuses &amp; Universities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Discipline / Field Filter */}
        <div>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--focus)]"
          >
            <option value="all">All Disciplinary Fields</option>
            {uniqueFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Count */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
        <span>
          Showing <strong className="text-[var(--text-primary)]">{filteredCandidates.length}</strong> verified student candidates
        </span>
        {shortlist.length > 0 && (
          <span>{shortlist.length} candidate(s) bookmarked</span>
        )}
      </div>

      {/* Candidates List / Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => {
            const isBookmarked = shortlist.includes(candidate.id);
            const targetUrl = candidate.username ? `/u/${candidate.username}` : `/u/${candidate.id}`;

            return (
              <div
                key={candidate.id}
                className="bento-card p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {candidate.avatar_url || candidate.avatar_path ? (
                        <img
                          src={candidate.avatar_url || candidate.avatar_path || undefined}
                          alt={candidate.display_name}
                          className="w-11 h-11 rounded-[var(--radius-sm)] object-cover border border-[var(--border)]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                          {candidate.display_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={targetUrl}
                            className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                          >
                            {candidate.display_name}
                          </Link>
                          {candidate.is_verified && (
                            <span title="Verified Scholar">
                              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                          {candidate.headline || candidate.field || 'Student Scholar'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(candidate.id)}
                      title={isBookmarked ? 'Remove from shortlist' : 'Add to shortlist'}
                      className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[var(--accent)] fill-current" aria-hidden="true" />
                      ) : (
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {candidate.institution && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                      <Building className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{candidate.institution.name}</span>
                    </div>
                  )}

                  {candidate.bio && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {candidate.bio}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {candidate.field || 'General Studies'}
                  </span>

                  <Link
                    href={targetUrl}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    <span>View Evidence</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bento-card p-12 text-center space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            No candidates matched the current skill, campus, or field filters.
          </p>
          {(skillFilter || selectedCommunity !== 'all' || selectedField !== 'all') && (
            <button
              onClick={() => {
                setSkillFilter('');
                setSelectedCommunity('all');
                setSelectedField('all');
              }}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
