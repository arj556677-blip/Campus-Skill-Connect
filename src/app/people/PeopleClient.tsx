'use client';

import React, { useState, useMemo } from 'react';
import { Profile, Community, Zone } from '@/lib/types';
import ProfileCard from '@/components/cards/ProfileCard';
import { Search, Users, Building, MapPin, Sparkles, X, ShieldCheck } from 'lucide-react';

import { useRole } from '@/lib/auth/role-context';

interface PeopleClientProps {
  initialProfiles: Profile[];
  communities: Community[];
  zones: Zone[];
  initialZone?: string;
  initialCommunity?: string;
  initialRole?: string;
}

// Known regional mapping between university campuses and innovation hubs
const COMMUNITY_ZONE_MAP: Record<string, string> = {
  'a1111111-1111-1111-1111-111111111111': 'c1111111-1111-1111-1111-111111111111', // IIT Bombay -> Mumbai Tech Hub
  'a2222222-2222-2222-2222-222222222222': 'c1111111-1111-1111-1111-111111111111', // NID -> Western/Mumbai
  'a3333333-3333-3333-3333-333333333333': 'c3333333-3333-3333-3333-333333333333', // JNU -> Delhi NCR
  'a4444444-4444-4444-4444-444444444444': 'c2222222-2222-2222-2222-222222222222', // IIMB -> Bangalore Silicon Valley
  'a5555555-5555-5555-5555-555555555555': 'c2222222-2222-2222-2222-222222222222', // IISc -> Bangalore Silicon Valley
  'a6666666-6666-6666-6666-666666666666': 'c4444444-4444-4444-4444-444444444444', // BITS -> Hyderabad Tech City
  'comm-1': 'zone-1',
  'comm-2': 'zone-2',
  'comm-3': 'zone-1',
  'comm-4': 'zone-3',
};

export default function PeopleClient({
  initialProfiles,
  communities,
  zones,
  initialZone,
  initialCommunity,
  initialRole,
}: PeopleClientProps) {
  const { currentUser, isLoggedIn } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>(initialRole || 'all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>(initialCommunity || 'all');
  const [selectedZone, setSelectedZone] = useState<string>(initialZone || 'all');

  // Filter out system administration accounts AND current logged-in user (self cannot collaborate with self)
  const talentProfiles = useMemo(() => {
    return initialProfiles.filter((p) => {
      // 1. Exclude platform administrators
      if (p.role === 'admin') return false;

      // 2. Exclude current logged in user from talent collaboration directory
      if (isLoggedIn && currentUser) {
        if (p.id === currentUser.id) return false;
        const pEmail = (p as unknown as { email?: string })?.email;
        if (currentUser.email && pEmail && pEmail.toLowerCase() === currentUser.email.toLowerCase()) return false;
        if (currentUser.name && p.display_name && p.display_name.trim().toLowerCase() === currentUser.name.trim().toLowerCase()) return false;
        // Seed/demo persona match for Ragav
        const curName = (currentUser.name || '').toLowerCase();
        const curEmail = (currentUser.email || '').toLowerCase();
        const pName = (p.display_name || '').toLowerCase();
        if ((curName.includes('ragav') || curEmail.includes('ragav')) && pName.includes('ragav')) {
          return false;
        }
      }
      return true;
    });
  }, [initialProfiles, isLoggedIn, currentUser]);

  // Handle changing institution with smart zone coordination
  const handleCommunityChange = (communityId: string) => {
    setSelectedCommunity(communityId);
    if (communityId !== 'all') {
      const associatedZone = COMMUNITY_ZONE_MAP[communityId];
      // If a zone is selected and it conflicts with the institution's actual zone, reset or sync it
      if (selectedZone !== 'all' && associatedZone && selectedZone !== associatedZone) {
        setSelectedZone('all');
      }
    }
  };

  // Handle changing zone with smart institution coordination
  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (zoneId !== 'all' && selectedCommunity !== 'all') {
      const associatedZone = COMMUNITY_ZONE_MAP[selectedCommunity];
      if (associatedZone && associatedZone !== zoneId) {
        setSelectedCommunity('all');
      }
    }
  };

  // Selected Zone object
  const selectedZoneObj = useMemo(() => {
    return zones.find((z) => z.id === selectedZone);
  }, [zones, selectedZone]);

  const filteredProfiles = useMemo(() => {
    return talentProfiles.filter((profile) => {
      // 1. Role filter
      const matchesRole = selectedRole === 'all' || profile.role === selectedRole;

      // 2. Institution / Community filter
      const matchesCommunity =
        selectedCommunity === 'all' ||
        profile.institution_id === selectedCommunity ||
        profile.institution?.id === selectedCommunity;

      // 3. Zone filter with multi-level fallback
      const matchesZone =
        selectedZone === 'all' ||
        profile.zone_id === selectedZone ||
        profile.zone?.id === selectedZone ||
        (profile.institution_id && COMMUNITY_ZONE_MAP[profile.institution_id] === selectedZone) ||
        Boolean(
          selectedZoneObj &&
            ((profile.campus?.location &&
              profile.campus.location.toLowerCase().includes(selectedZoneObj.city.toLowerCase())) ||
              (profile.institution?.description &&
                profile.institution.description.toLowerCase().includes(selectedZoneObj.city.toLowerCase())) ||
              (profile.institution?.name &&
                profile.institution.name.toLowerCase().includes(selectedZoneObj.city.toLowerCase())))
        );

      // 4. Query filter
      const matchesQuery =
        !searchQuery ||
        profile.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.field?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesCommunity && matchesZone && matchesQuery;
    });
  }, [talentProfiles, selectedRole, selectedCommunity, selectedZone, searchQuery, selectedZoneObj]);

  // Precompute builder counts per community and per zone for clear UX
  const communityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of talentProfiles) {
      if (p.institution_id) {
        map[p.institution_id] = (map[p.institution_id] || 0) + 1;
      }
    }
    return map;
  }, [talentProfiles]);

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of talentProfiles) {
      const zId = p.zone_id || (p.institution_id ? COMMUNITY_ZONE_MAP[p.institution_id] : null);
      if (zId) {
        map[zId] = (map[zId] || 0) + 1;
      }
    }
    return map;
  }, [talentProfiles]);

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
            Discover student developers, ML researchers, product designers, and faculty mentors across verified campuses and innovation zones.
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
                title="Clear search"
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
                {role === 'all' ? 'All Roles' : role === 'student' ? 'Students' : role === 'faculty' ? 'Faculty Mentors' : 'Recruiters'}
              </button>
            ))}
          </div>
        </div>

        {/* Community & Zone Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Institution Selector */}
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCommunity}
              onChange={(e) => handleCommunityChange(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-full px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1b59f8] max-w-xs truncate"
            >
              <option value="all">All Institutions &amp; Campuses</option>
              {communities.map((c) => {
                const count = communityCounts[c.id];
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} {count ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedZone}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 rounded-full px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1b59f8]"
            >
              <option value="all">All Innovation Zones</option>
              {zones.map((z) => {
                const count = zoneCounts[z.id];
                return (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.city}) {count ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reset Filters & Active Filter Badges */}
          {(selectedRole !== 'all' || selectedCommunity !== 'all' || selectedZone !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRole('all');
                setSelectedCommunity('all');
                setSelectedZone('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#1b59f8] hover:underline font-bold ml-auto transition-colors flex items-center gap-1"
            >
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {(selectedRole !== 'all' || selectedCommunity !== 'all' || selectedZone !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400 font-medium">Active:</span>
            {selectedRole !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                Role: {selectedRole}
                <button onClick={() => setSelectedRole('all')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCommunity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                {communities.find((c) => c.id === selectedCommunity)?.name || 'Institution'}
                <button onClick={() => setSelectedCommunity('all')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedZone !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
                {zones.find((z) => z.id === selectedZone)?.name || 'Innovation Zone'}
                <button onClick={() => setSelectedZone('all')} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
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
              Try adjusting your search criteria, switching innovation zones, or clicking &quot;Reset Filters&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedRole('all');
                setSelectedCommunity('all');
                setSelectedZone('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#1b59f8] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              Reset Filters
            </button>
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
