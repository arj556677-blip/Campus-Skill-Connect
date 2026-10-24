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
  const [likes, setLikes] = useState(work.likes_count ?? 0);
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
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 p-3.5 justify-between">
      {/* Cover Media */}
      <Link href={`/works/${work.id}`} className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 block">
        {work.storage_path ? (
          <img
            src={work.storage_path}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
            <Sparkles className="w-8 h-8 mb-2 opacity-70 animate-sparkle-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wide text-blue-700">Verified Campus Proof</span>
          </div>
        )}

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b59f8] text-white text-[10px] font-bold shadow-sm transition-transform duration-200 hover:scale-105">
          <span>{getCategoryLabel(work.category)}</span>
        </div>

        {/* Arrow Action Badge */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 shadow-sm flex items-center justify-center group-hover:bg-[#0f172a] group-hover:text-white group-hover:scale-110 transition-all duration-200">
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex-1 flex flex-col pt-3.5 px-1 pb-1">
        <Link href={`/works/${work.id}`}>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1b59f8] transition-colors line-clamp-1">
            {work.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {work.description}
        </p>

        {/* Skill Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {work.skills?.slice(0, 3).map((skill, index) => {
            const skillId =
              skill?.id ||
              (skill as { skills?: { id?: string } })?.skills?.id ||
              skill?.name ||
              (skill as { skills?: { name?: string } })?.skills?.name ||
              `skill-${work.id}-${index}`;
            const skillName =
              skill?.name ||
              (skill as { skills?: { name?: string } })?.skills?.name ||
              (typeof skill === 'string' ? skill : 'Skill');
            return (
              <span
                key={skillId}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-[10px] font-semibold text-slate-600 border border-slate-200/60 transition-colors"
              >
                #{skillName}
              </span>
            );
          })}
          {(work.skills?.length || 0) > 3 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60">
              +{work.skills!.length - 3}
            </span>
          )}
        </div>

        {/* Card Footer: Author + Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          {work.owner ? (
            <Link
              href={`/profile/${work.owner.id}`}
              className="flex items-center gap-2 group/author"
            >
              {work.owner.avatar_url ? (
                <img
                  src={work.owner.avatar_url}
                  alt={work.owner.display_name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 transition-transform duration-200 group-hover/author:scale-110"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0f172a] text-white text-[9px] font-bold flex items-center justify-center transition-transform duration-200 group-hover/author:scale-110">
                  {work.owner.display_name.slice(0, 2)}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 group-hover/author:text-blue-600 truncate max-w-[120px] transition-colors">
                {work.owner.display_name}
              </span>
            </Link>
          ) : (
            <span className="text-xs font-semibold text-slate-500">Verified Builder</span>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-all duration-200 active:scale-125 ${
                liked ? 'text-rose-500 font-bold' : 'hover:text-rose-500 hover:scale-105'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
              <span className="text-[11px] font-semibold text-slate-600">{likes}</span>
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold text-slate-600">{work.views_count ?? 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
