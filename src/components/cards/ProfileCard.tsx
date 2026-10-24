'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/types';
import {
  ShieldCheck,
  MapPin,
  Building,
  UserPlus,
  UserCheck,
  Sparkles,
  Clock,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/SocialIcons';
import { useRole } from '@/lib/auth/role-context';
import {
  getConnection,
  sendConnectionRequest,
  unfollowConnection,
  CONNECTIONS_EVENT,
  ConnectionStatus,
} from '@/lib/connections/connection-store';

interface ProfileCardProps {
  profile: Profile;
  matchScore?: number;
}

export default function ProfileCard({ profile, matchScore }: ProfileCardProps) {
  const { currentUser, isLoggedIn } = useRole();
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('none');
  const [isIncoming, setIsIncoming] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if this card represents the logged in user himself
  const isSelf = Boolean(
    isLoggedIn &&
      currentUser &&
      (profile.id === currentUser.id ||
        (profile as unknown as { user_id?: string }).user_id === currentUser.id ||
        (currentUser.name && profile.display_name?.trim().toLowerCase() === currentUser.name?.trim().toLowerCase()) ||
        ((currentUser.name || currentUser.email || '').toLowerCase().includes('ragav') &&
          profile.display_name?.toLowerCase().includes('ragav')))
  );

  // Sync connection status from persistent store
  useEffect(() => {
    const syncStatus = () => {
      const item = getConnection(profile.id);
      if (item) {
        setConnStatus(item.status);
        setIsIncoming(item.isIncoming);
      } else {
        setConnStatus('none');
        setIsIncoming(false);
      }
    };

    syncStatus();

    const handleUpdate = () => syncStatus();
    window.addEventListener(CONNECTIONS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CONNECTIONS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [profile.id]);

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await sendConnectionRequest({
        id: profile.id,
        name: profile.display_name,
        headline: profile.headline || profile.field || undefined,
        avatar: profile.avatar_url || undefined,
        role: profile.role,
        institution: profile.institution?.name || profile.zone?.name || undefined,
      });
      setConnStatus('pending');
      setIsIncoming(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnfollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await unfollowConnection(profile.id);
      setConnStatus('none');
      setIsIncoming(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 justify-between">
      {/* Top Bar: Role & Match Score */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
            profile.role === 'student'
              ? 'bg-blue-50 text-[#1b59f8] border-blue-200'
              : profile.role === 'faculty'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : profile.role === 'recruiter'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {profile.role === 'student'
            ? 'Student'
            : profile.role === 'faculty'
            ? 'Faculty Mentor'
            : profile.role === 'recruiter'
            ? 'Recruiter'
            : 'Admin'}
        </span>

        {matchScore !== undefined && (
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-blue-600" />
            {matchScore}% Match
          </span>
        )}
      </div>

      {/* Main Avatar & Headline */}
      <div className="flex items-start gap-3.5">
        <Link href={`/profile/${profile.id}`} className="relative shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0f172a] text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {profile.display_name.slice(0, 2)}
            </div>
          )}
          {profile.is_verified && (
            <span
              title="Verified Student Identity"
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1b59f8] text-white flex items-center justify-center ring-2 ring-white"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${profile.id}`}>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {profile.display_name}
            </h4>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {profile.headline || profile.field}
          </p>
        </div>
      </div>

      {/* Bio excerpt */}
      {profile.bio && (
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Institution & Zone Chips */}
      <div className="mt-3.5 space-y-1 text-[11px] text-slate-500 font-mono">
        {profile.institution && (
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{profile.institution.name}</span>
          </div>
        )}
        {(profile.zone || profile.campus?.location) && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{profile.zone?.name || profile.campus?.location}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {profile.github_username && (
            <a
              href={`https://github.com/${profile.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Self check: if it is the current user, show non-actionable badge */}
        {isSelf ? (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-500">
            You
          </span>
        ) : connStatus === 'accepted' ? (
          /* Accepted Collab: Unfollow button with Chat button next to it */
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUnfollow}
              disabled={isUpdating}
              title="Click to unfollow / disconnect"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all"
            >
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>Unfollow</span>
            </button>

            <Link
              href={`/messages?recipientId=${encodeURIComponent(profile.id)}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1b59f8] hover:bg-blue-600 text-white shadow-xs transition-all active:scale-95"
              title={`Chat with ${profile.display_name}`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </Link>
          </div>
        ) : connStatus === 'pending' && !isIncoming ? (
          /* Sent Request: Displays 'Request Sent' and only changes on action by either party */
          <div className="flex items-center gap-1">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
              title="Connection request sent. Waiting for response."
            >
              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>Request Sent</span>
            </span>
          </div>
        ) : connStatus === 'pending' && isIncoming ? (
          /* Incoming Request: Link to dashboard / profile to respond */
          <Link
            href={`/profile/${profile.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1b59f8] text-white shadow-xs hover:bg-blue-600 transition-all"
          >
            <span>Respond</span>
          </Link>
        ) : (
          /* None: Connect button */
          <button
            onClick={handleConnect}
            disabled={isUpdating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0f172a] hover:bg-[#1b59f8] text-white active:scale-95 shadow-xs transition-all disabled:opacity-50"
          >
            {isUpdating ? (
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
      </div>
    </div>
  );
}
