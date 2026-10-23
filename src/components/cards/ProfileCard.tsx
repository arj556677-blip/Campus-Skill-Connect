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
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 justify-between">
      {/* Top Bar: Role & Match Score */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
            profile.role === 'student'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : profile.role === 'faculty'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : profile.role === 'recruiter'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {profile.role}
        </span>

        {matchScore !== undefined ? (
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-blue-600" />
            {matchScore}% Match
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
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

        <button
          onClick={handleConnect}
          disabled={connected || connecting}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            connected
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : connecting
              ? 'bg-slate-100 text-slate-400 animate-pulse'
              : 'bg-[#0f172a] hover:bg-[#1b59f8] text-white active:scale-95 shadow-xs'
          }`}
        >
          {connected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Connected</span>
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
