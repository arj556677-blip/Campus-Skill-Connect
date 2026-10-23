'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ExternalLink,
  Sparkles,
  KeyRound,
  FileCheck,
  AlertTriangle,
  Radio,
  Search,
  Filter,
} from 'lucide-react';
import { CollaborationRoom, ConfidentialityLevel, MeetingProvider } from '@/lib/types';

interface CollaborateClientProps {
  initialRooms: CollaborationRoom[];
}

export default function CollaborateClient({ initialRooms }: CollaborateClientProps) {
  const [rooms, setRooms] = useState<CollaborationRoom[]>(initialRooms);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'confidential' | 'webrtc'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal State
  const [roomType, setRoomType] = useState<MeetingProvider>('google_meet');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [confidentialityLevel, setConfidentialityLevel] = useState<ConfidentialityLevel>('recruiter_private');
  const [passcode, setPasscode] = useState('');
  const [customMeetUrl, setCustomMeetUrl] = useState('');
  const [hostApproval, setHostApproval] = useState(true);
  const [ndaRequired, setNdaRequired] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);

    try {
      if (roomType === 'google_meet') {
        const res = await fetch('/api/collab/google-meet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle,
            description: newDesc,
            confidentialityLevel,
            passcode: passcode || undefined,
            customMeetUrl: customMeetUrl || undefined,
            hostApprovalRequired: hostApproval,
            ndaRequired,
          }),
        });
        const data = await res.json();
        if (data.room) {
          setRooms((prev) => [data.room, ...prev]);
        }
      } else {
        const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        const newRoom: CollaborationRoom = {
          id: 'room-' + Date.now(),
          title: newTitle.trim(),
          description: newDesc.trim() || 'Open peer sprint and code pairing room.',
          creator_id: 'user-current',
          room_slug: slug,
          is_active: true,
          provider: 'webrtc_jitsi',
          is_confidential: false,
          confidentiality_level: 'public',
          meeting_link: `https://meet.jit.si/CampusSkillConnect-${slug}`,
          created_at: new Date().toISOString(),
          creator: {
            id: 'user-current',
            display_name: 'Alex Rivera',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            headline: 'MCA Final Year',
            bio: '',
            role: 'student',
            institution_id: null,
            campus_id: null,
            zone_id: null,
            field: 'Computer Applications',
            profile_visibility: 'worldwide',
            is_verified: true,
            github_username: null,
            linkedin_url: null,
            website_url: null,
            created_at: '',
            updated_at: '',
            skills: [],
          },
        };
        setRooms((prev) => [newRoom, ...prev]);
      }

      setNewTitle('');
      setNewDesc('');
      setPasscode('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRoomLink = (room: CollaborationRoom) => {
    const url = `${window.location.origin}/collaborate/${room.room_slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(room.room_slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter =
      selectedFilter === 'all'
        ? true
        : selectedFilter === 'confidential'
        ? room.is_confidential || room.provider === 'google_meet'
        : room.provider === 'webrtc_jitsi' || !room.is_confidential;

    const matchesQuery =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  const confidentialCount = rooms.filter((r) => r.is_confidential || r.provider === 'google_meet').length;
  const webrtcCount = rooms.filter((r) => !r.is_confidential && r.provider !== 'google_meet').length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#131726] to-[#0c0e17] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-mono font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DUAL-ENGINE COLLABORATION HUB</span>
              <span className="text-white/30">•</span>
              <span className="text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Google Meet API Confidentiality
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Virtual Collab &amp; Confidential Rooms
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Launch instant <strong className="text-white">WebRTC open sprint rooms</strong> for student hackathons, or host secure, closed-door <strong className="text-amber-300">Confidential Google Meet sessions</strong> with verified NDA agreements, knock-to-enter access control, and recruiter 1:1 encryption.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                setRoomType('google_meet');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 border border-amber-400/30"
            >
              <Lock className="w-4 h-4 text-amber-200" />
              <span>Create Confidential Meet</span>
            </button>

            <button
              onClick={() => {
                setRoomType('webrtc_jitsi');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold border border-white/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Open Sprint Room</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Total Active
            </div>
            <div className="text-xl font-bold text-white mt-1">{rooms.length} Rooms</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Confidential Meets
            </div>
            <div className="text-xl font-bold text-amber-200 mt-1">{confidentialCount} Sessions</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              WebRTC Sprints
            </div>
            <div className="text-xl font-bold text-emerald-200 mt-1">{webrtcCount} Mesh Rooms</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
            <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Protection Level
            </div>
            <div className="text-xl font-bold text-purple-200 mt-1">E2EE • Google Meet API</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0f111a] border border-white/10 w-fit">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-violet-600 text-white shadow-soft'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setSelectedFilter('confidential')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'confidential'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Confidential Google Meets ({confidentialCount})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('webrtc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'webrtc'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>WebRTC Sprints ({webrtcCount})</span>
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1017] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isGoogleMeet = room.provider === 'google_meet';

          return (
            <div
              key={room.id}
              className={`rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 relative overflow-hidden group ${
                isGoogleMeet
                  ? 'bg-gradient-to-b from-[#14121a] to-[#0c0d14] border border-amber-500/25 hover:border-amber-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
                  : 'bg-[#0f111a] border border-white/10 hover:border-violet-500/40 shadow-soft'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isGoogleMeet
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600'
                }`}
              />

              <div className="space-y-3.5">
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2">
                  {isGoogleMeet ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Google Meet API • Confidential</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>WebRTC Live Mesh</span>
                    </div>
                  )}

                  <button
                    onClick={() => copyRoomLink(room)}
                    className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
                    title="Copy Invite Link"
                  >
                    {copiedSlug === room.room_slug ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-white group-hover:text-violet-200 transition-colors line-clamp-2">
                  {room.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                {/* Confidential Security Pills */}
                {isGoogleMeet && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      {room.confidentiality_level && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-600/30 text-amber-300 uppercase font-bold">
                          {room.confidentiality_level.replace('_', ' ')}
                        </span>
                      )}
                      {room.host_approval_required && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Knock Required
                        </span>
                      )}
                      {room.nda_required && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-center gap-1">
                          <FileCheck className="w-2.5 h-2.5" /> NDA Active
                        </span>
                      )}
                    </div>

                    {room.passcode && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05]">
                        <KeyRound className="w-3 h-3 text-amber-400" />
                        <span>Passcode: <strong className="text-amber-300">{room.passcode}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

                {/* Room Footer & Actions */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                {room.creator && (
                  <div className="flex items-center gap-2">
                    {room.creator.avatar_url ? (
                      <img
                        src={room.creator.avatar_url}
                        alt={room.creator.display_name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {room.creator.display_name.slice(0, 2)}
                      </div>
                    )}
                    <span className="text-[11px] text-zinc-400 truncate font-mono">
                      Host: <strong className="text-zinc-200">{room.creator.display_name}</strong>
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {isGoogleMeet ? (
                    <>
                      <a
                        href={
                          room.meeting_link && !room.meeting_link.includes('qxm-') && !room.meeting_link.includes('zkw-')
                            ? room.meeting_link
                            : 'https://meet.google.com/new'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch Google Meet</span>
                      </a>
                      <Link
                        href={`/collaborate/${room.room_slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-[11px] font-medium transition-colors"
                      >
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Session Console &amp; Security Brief</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/collaborate/${room.room_slug}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enter Room &amp; Join Call</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-[#0e1017] border border-white/10 space-y-3">
          <Lock className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No rooms match your filter</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search query or create a new confidential meeting.</p>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#121420] border border-white/15 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>MEETING PROVISIONING CONSOLE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Launch Collaboration Session
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Configure your meeting engine, privacy classification, and access restrictions.
              </p>
            </div>

            {/* Provider Switcher Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => setRoomType('google_meet')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  roomType === 'google_meet'
                    ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border border-amber-500/40 text-amber-300'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Meet API</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-normal">Confidential • NDA • Knock</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('webrtc_jitsi')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  roomType === 'webrtc_jitsi'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WebRTC Sprint</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-normal">Open Peer Mesh • Instant</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Meeting Topic / Sprint Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    roomType === 'google_meet'
                      ? 'e.g. Confidential Staff Recruiter 1:1 Architecture Review'
                      : 'e.g. Distributed Task Queue Code Review'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Description / Agenda (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline the agenda, expected outcomes, or candidate profile..."
                  className="w-full px-4 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Google Meet Confidential Options */}
              {roomType === 'google_meet' && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3.5">
                  <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confidential Meeting Security Controls</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                      Classification Level
                    </label>
                    <select
                      value={confidentialityLevel}
                      onChange={(e) => setConfidentialityLevel(e.target.value as ConfidentialityLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="recruiter_private">Private Recruiter 1:1 (Interview &amp; Offer)</option>
                      <option value="restricted_nda">Restricted NDA (IP, Thesis &amp; Patent Disclosure)</option>
                      <option value="confidential">Confidential Team Sprint (Internal Only)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                        Google Meet URL / Code (Optional)
                      </label>
                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Launch New Meet</span>
                      </a>
                    </div>
                    <input
                      type="text"
                      value={customMeetUrl}
                      onChange={(e) => setCustomMeetUrl(e.target.value)}
                      placeholder="e.g. meet.google.com/abc-defg-hij (or leave blank to auto-launch)"
                      className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Leave blank to auto-launch a fresh meeting via <span className="text-amber-300 font-mono">meet.google.com/new</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                      Custom Passcode (Optional - Auto-generated if blank)
                    </label>
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="e.g. FAANG-CONF-2026"
                      className="w-full px-3 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={hostApproval}
                        onChange={(e) => setHostApproval(e.target.checked)}
                        className="rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                      />
                      <span>Enforce host admission knock (no unauthorized entry)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={ndaRequired}
                        onChange={(e) => setNdaRequired(e.target.checked)}
                        className="rounded border-white/20 bg-black text-amber-500 focus:ring-amber-500"
                      />
                      <span>Require digital NDA acceptance before unlocking meeting URL</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all disabled:opacity-50 ${
                    roomType === 'google_meet'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-soft'
                  }`}
                >
                  {isSubmitting ? 'Provisioning...' : roomType === 'google_meet' ? 'Launch Confidential Meet' : 'Create Sprint Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
