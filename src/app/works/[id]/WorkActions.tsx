'use client';

import React, { useState } from 'react';
import { Heart, Share2, Check, ExternalLink } from 'lucide-react';

interface WorkActionsProps {
  workId: string;
  initialLikes: number;
  externalUrl?: string | null;
}

export default function WorkActions({ workId, initialLikes, externalUrl }: WorkActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLike}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
          liked
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            : 'bg-white/[0.06] text-white border-white/10 hover:border-white/20 hover:bg-white/[0.1]'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'}`} />
        <span>{likes} Endorsements</span>
      </button>

      <button
        onClick={copyShareLink}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.06] text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.1] transition-all"
        title="Copy Share Link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold font-mono">Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-zinc-400" />
            <span>Share</span>
          </>
        )}
      </button>

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all shadow-[0_0_15px_rgba(139,92,246,0.15)]"
        >
          <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          <span>Demo</span>
        </a>
      )}
    </div>
  );
}
