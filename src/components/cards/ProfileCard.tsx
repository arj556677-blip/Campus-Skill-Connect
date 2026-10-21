'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/types';
import { ShieldCheck, MapPin, Building, UserPlus, Check, Sparkles } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/SocialIcons';

interface ProfileCardProps {
  profile: Profile;
  matchScore?: number;
}

export default function ProfileCard({ profile, matchScore }: ProfileCardProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 600);
  };

  return (
    <div className="bento-card group relative flex flex-col rounded-2xl p-5 transition-all duration-300">
      {/* Top Bar: Role & Match Score */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
            profile.role === 'student'
              ? 'bg-violet-500/15 text-violet-300 border-violet-500/25'
              : profile.role === 'faculty'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25'
              : profile.role === 'recruiter'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
              : 'bg-white/10 text-zinc-300 border-white/15'
          }`}
        >
          {profile.role}
        </span>

        {matchScore !== undefined ? (
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            {matchScore}% Match
          </span>
        ) : (
          <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
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
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-violet-500/50 transition-all"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
              {profile.display_name.slice(0, 2)}
            </div>
          )}
          {profile.is_verified && (
            <span
              title="Verified Student Identity"
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center ring-2 ring-[#0d0f17]"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${profile.id}`}>
            <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors truncate">
              {profile.display_name}
            </h4>
          </Link>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            {profile.headline || profile.field}
          </p>
        </div>
      </div>

      {/* Bio excerpt */}
      {profile.bio && (
        <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Institution & Zone Chips */}
      <div className="mt-3.5 space-y-1 text-[11px] text-zinc-400 font-mono">
        {profile.institution && (
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{profile.institution.name}</span>
          </div>
        )}
        {profile.zone && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{profile.zone.name}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {profile.github_username && (
            <a
              href={`https://github.com/${profile.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>

        <button
          onClick={handleConnect}
          disabled={connected || connecting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            connected
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
              : connecting
              ? 'bg-white/10 text-zinc-400 animate-pulse'
              : 'bg-white/10 text-white hover:bg-violet-600 hover:text-white border border-white/15 active:scale-95'
          }`}
        >
          {connected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Requested</span>
            </>
          ) : connecting ? (
            <span>Sending...</span>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
