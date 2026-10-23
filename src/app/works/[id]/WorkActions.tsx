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
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
          liked
            ? 'bg-rose-50 text-rose-600 border-rose-200 font-bold'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        <span>{likes} Endorsements</span>
      </button>

      <button
        onClick={copyShareLink}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-xs"
        title="Copy Share Link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-semibold font-mono">Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share</span>
          </>
        )}
      </button>

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#0f172a] hover:bg-black text-white transition-all shadow-sm active:scale-95"
        >
          <ExternalLink className="w-3.5 h-3.5 text-white" />
          <span>Demo</span>
        </a>
      )}
    </div>
  );
}
