'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, MessageSquare, Share2, Check } from 'lucide-react';

interface ProfileActionsProps {
  profileId: string;
}

export default function ProfileActions({ profileId }: ProfileActionsProps) {
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleConnect}
        disabled={connected}
        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
          connected
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-95'
        }`}
      >
        {connected ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Connection Requested</span>
          </>
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect</span>
          </>
        )}
      </button>

      <Link
        href="/messages"
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-semibold hover:bg-white/[0.12] transition-all"
      >
        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
        <span>Message</span>
      </Link>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white transition-all"
        title="Share Profile"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold font-mono">Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
