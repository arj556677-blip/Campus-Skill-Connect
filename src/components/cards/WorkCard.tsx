'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Work } from '@/lib/types';
import { Heart, Eye, Sparkles, ArrowUpRight } from 'lucide-react';
import { getCategoryLabel } from '@/lib/utils';

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  const [likes, setLikes] = useState(work.likes_count);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  return (
    <div className="bento-card group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300">
      {/* Cover Media */}
      <Link href={`/works/${work.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 block">
        {work.storage_path ? (
          <img
            src={work.storage_path}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-violet-950/40 to-slate-900 text-violet-400">
            <Sparkles className="w-8 h-8 mb-2 opacity-60" />
            <span className="text-[11px] font-mono font-medium tracking-wide text-zinc-400">Verified Campus Work</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e15] via-transparent to-transparent opacity-80" />

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-semibold text-zinc-200">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          {getCategoryLabel(work.category)}
        </div>

        {/* Arrow Action Badge */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-violet-500/50 group-hover:bg-violet-600/30 transition-all">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-5">
        <Link href={`/works/${work.id}`}>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-violet-300 transition-colors line-clamp-1">
            {work.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {work.description}
        </p>

        {/* Skill Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {work.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono font-medium text-zinc-300 border border-white/[0.06]"
            >
              #{skill.name}
            </span>
          ))}
          {(work.skills?.length || 0) > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06]">
              +{work.skills!.length - 3}
            </span>
          )}
        </div>

        {/* Card Footer: Author + Metrics */}
        <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
          {work.owner ? (
            <Link
              href={`/profile/${work.owner.id}`}
              className="flex items-center gap-2 group/author"
            >
              {work.owner.avatar_url ? (
                <img
                  src={work.owner.avatar_url}
                  alt={work.owner.display_name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {work.owner.display_name.slice(0, 2)}
                </div>
              )}
              <span className="text-[11px] font-medium text-zinc-300 group-hover/author:text-white truncate max-w-[120px]">
                {work.owner.display_name}
              </span>
            </Link>
          ) : (
            <span className="text-[11px] text-zinc-400">Verified Builder</span>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="text-[11px]">{likes}</span>
            </button>
            <span className="flex items-center gap-1 text-zinc-400">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px]">{work.views_count}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
