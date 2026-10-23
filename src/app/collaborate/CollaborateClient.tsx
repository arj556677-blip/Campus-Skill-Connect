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
      const res = await fetch('/api/collab/google-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          confidentialityLevel,
          passcode: passcode || undefined,
          customMeetUrl: roomType === 'webrtc_jitsi' 
            ? `https://meet.jit.si/CampusSkillConnect-${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` 
            : (customMeetUrl || undefined),
          hostApprovalRequired: hostApproval,
          ndaRequired,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create room. Please ensure you are signed in.');
        return;
      }

      if (data.room) {
        setRooms((prev) => [data.room, ...prev]);
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
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#1b59f8] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DUAL-ENGINE COLLABORATION HUB</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" /> Google Meet API Confidentiality
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Virtual Collab &amp; Confidential Rooms
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Launch instant <strong className="text-slate-900">WebRTC open sprint rooms</strong> for student hackathons, or host secure, closed-door <strong className="text-slate-900">Confidential Google Meet sessions</strong> with verified NDA agreements, knock-to-enter access control, and recruiter 1:1 encryption.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                setRoomType('google_meet');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Create Confidential Meet</span>
            </button>

            <button
              onClick={() => {
                setRoomType('webrtc_jitsi');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 active:scale-95 transition-all shadow-xs flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Open Sprint Room</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Total Active
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{rooms.length} Rooms</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Confidential Meets
            </div>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">{confidentialCount} Sessions</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              WebRTC Sprints
            </div>
            <div className="text-2xl font-extrabold text-emerald-900 mt-1">{webrtcCount} Mesh Rooms</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80">
            <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1b59f8]" />
              Protection Level
            </div>
            <div className="text-sm font-bold text-blue-950 mt-2">E2EE • Google Meet API</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setSelectedFilter('confidential')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'confidential'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Confidential ({confidentialCount})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('webrtc')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'webrtc'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>WebRTC ({webrtcCount})</span>
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8] shadow-xs"
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
              className={`rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 relative overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 group`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isGoogleMeet
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-[#1b59f8]'
                }`}
              />

              <div className="space-y-3.5">
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2">
                  {isGoogleMeet ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Google Meet API • Confidential</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>WebRTC Live Mesh</span>
                    </div>
                  )}

                  <button
                    onClick={() => copyRoomLink(room)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                    title="Copy Invite Link"
                  >
                    {copiedSlug === room.room_slug ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1b59f8] transition-colors line-clamp-2">
                  {room.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                {/* Confidential Security Pills */}
                {isGoogleMeet && (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {room.confidentiality_level && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 uppercase font-bold">
                          {room.confidentiality_level.replace('_', ' ')}
                        </span>
                      )}
                      {room.host_approval_required && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-2.5 h-2.5" /> Knock Required
                        </span>
                      )}
                      {room.nda_required && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1 font-semibold">
                          <FileCheck className="w-2.5 h-2.5" /> NDA Active
                        </span>
                      )}
                    </div>

                    {room.passcode && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>Passcode: <strong className="text-slate-900">{room.passcode}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Room Footer & Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {room.creator && (
                  <div className="flex items-center gap-2">
                    {room.creator.avatar_url ? (
                      <img
                        src={room.creator.avatar_url}
                        alt={room.creator.display_name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#1b59f8] text-white text-[9px] font-bold flex items-center justify-center">
                        {room.creator.display_name.slice(0, 2)}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-500 truncate">
                      Host: <strong className="text-slate-800">{room.creator.display_name}</strong>
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
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch Google Meet</span>
                      </a>
                      <Link
                        href={`/collaborate/${room.room_slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Session Console &amp; Security Brief</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/collaborate/${room.room_slug}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95"
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
        <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <Lock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No rooms match your filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or create a new confidential meeting.</p>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1b59f8] mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>MEETING PROVISIONING CONSOLE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Launch Collaboration Session
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure your meeting engine, privacy classification, and access restrictions.
              </p>
            </div>

            {/* Provider Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setRoomType('google_meet')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  roomType === 'google_meet'
                    ? 'bg-white shadow-xs text-slate-900 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Meet API</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Confidential • NDA • Knock</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('webrtc_jitsi')}
                className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  roomType === 'webrtc_jitsi'
                    ? 'bg-white shadow-xs text-slate-900 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WebRTC Sprint</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Open Peer Mesh • Instant</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Agenda (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline the agenda, expected outcomes, or candidate profile..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              {/* Google Meet Confidential Options */}
              {roomType === 'google_meet' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3.5">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Confidential Meeting Security Controls</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Classification Level
                    </label>
                    <select
                      value={confidentialityLevel}
                      onChange={(e) => setConfidentialityLevel(e.target.value as ConfidentialityLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="recruiter_private">Private Recruiter 1:1 (Interview &amp; Offer)</option>
                      <option value="restricted_nda">Restricted NDA (IP, Thesis &amp; Patent Disclosure)</option>
                      <option value="confidential">Confidential Team Sprint (Internal Only)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                        Google Meet URL / Code (Optional)
                      </label>
                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
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
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Leave blank to auto-launch a fresh meeting via <span className="text-amber-700 font-mono">meet.google.com/new</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Custom Passcode (Optional - Auto-generated if blank)
                    </label>
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="e.g. FAANG-CONF-2026"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={hostApproval}
                        onChange={(e) => setHostApproval(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Enforce host admission knock (no unauthorized entry)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={ndaRequired}
                        onChange={(e) => setNdaRequired(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Require digital NDA acceptance before unlocking meeting URL</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className={`px-6 py-2.5 rounded-full text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 ${
                    roomType === 'google_meet'
                      ? 'bg-[#0f172a] hover:bg-black'
                      : 'bg-[#1b59f8] hover:bg-[#174ed8]'
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
