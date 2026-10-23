'use client';

import React, { useState, useMemo } from 'react';
import { Profile, Community, Zone } from '@/lib/types';
import ProfileCard from '@/components/cards/ProfileCard';
import { Search, Users, Building, MapPin, Sparkles, X, ShieldCheck } from 'lucide-react';

interface PeopleClientProps {
  initialProfiles: Profile[];
  communities: Community[];
  zones: Zone[];
}

export default function PeopleClient({
  initialProfiles,
  communities,
  zones,
}: PeopleClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((profile) => {
      const matchesRole = selectedRole === 'all' || profile.role === selectedRole;
      const matchesCommunity =
        selectedCommunity === 'all' || profile.institution_id === selectedCommunity;
      const matchesZone = selectedZone === 'all' || profile.zone_id === selectedZone;
      const matchesQuery =
        !searchQuery ||
        profile.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.field?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesCommunity && matchesZone && matchesQuery;
    });
  }, [initialProfiles, selectedRole, selectedCommunity, selectedZone, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1b59f8] font-bold mb-1.5">
            <Users className="w-4 h-4" />
            <span>Cross-Campus Peer Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Campus Talent Directory
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xl">
            Discover student developers, ML researchers, product designers, and faculty mentors.
            Protected by consent-based networking.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold self-start md:self-end">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero Web Scraping • Student-First Privacy</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, topic (e.g. Distributed Systems, YOLOv9, UI/UX)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {['all', 'student', 'faculty', 'recruiter'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedRole === role
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Community & Zone Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-full px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1b59f8]"
            >
              <option value="all">All Institutions &amp; Campuses</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-full px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1b59f8]"
            >
              <option value="all">All Innovation Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.city})
                </option>
              ))}
            </select>
          </div>

          {(selectedRole !== 'all' || selectedCommunity !== 'all' || selectedZone !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRole('all');
                setSelectedCommunity('all');
                setSelectedZone('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#1b59f8] hover:underline font-bold ml-auto transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredProfiles.length}</strong> campus builder{filteredProfiles.length === 1 ? '' : 's'}
          </span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No builders found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
