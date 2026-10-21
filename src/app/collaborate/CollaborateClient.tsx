'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import { CollaborationRoom } from '@/lib/types';

interface CollaborateClientProps {
  initialRooms: CollaborationRoom[];
}

export default function CollaborateClient({ initialRooms }: CollaborateClientProps) {
  const [rooms, setRooms] = useState<CollaborationRoom[]>(initialRooms);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const newRoom: CollaborationRoom = {
      id: 'room-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Active collaboration session.',
      creator_id: 'user-1',
      room_slug: slug,
      is_active: true,
      meeting_link: `https://meet.jit.si/CampusSkillConnect-${slug}`,
      created_at: new Date().toISOString(),
      creator: {
        id: 'user-1',
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
        skills: [],
      },
    };

    setRooms([newRoom, ...rooms]);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const copyRoomLink = (room: CollaborationRoom) => {
    const url = `${window.location.origin}/collaborate/${room.room_slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(room.room_slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1.5">
            <Video className="w-4 h-4" />
            <span>WebRTC Meeting Engine • Jitsi Cloud</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Virtual Collaboration Rooms
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Zero-friction, instant video meeting and code-pairing rooms. Invite campus peers, share screens, and build together.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all self-start md:self-end"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>Create Instant Room</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl bento-card p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Room
                </span>

                <button
                  onClick={() => copyRoomLink(room)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                  title="Copy Invite Link"
                >
                  {copiedSlug === room.room_slug ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <h3 className="font-bold text-base text-white line-clamp-2">
                {room.title}
              </h3>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Room Footer */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
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

              <Link
                href={`/collaborate/${room.room_slug}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter Room &amp; Join Call</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="rounded-2xl bg-[#12141f] border border-white/10 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-400">
                <Video className="w-4 h-4" />
                <span>NEW WEBRTC SESSION</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Create Collaboration Room
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Launches an instant, zero-login video and screen-share room with peer presence tracking.
              </p>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Room Topic / Sprint Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue Code Review"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Description / Goals (Optional)
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline what you will work on in this sprint..."
                  className="w-full px-4 py-2 rounded-xl bg-[#090b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-soft hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  Launch Room Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
