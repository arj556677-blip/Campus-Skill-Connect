'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, Check, ExternalLink } from 'lucide-react';

interface LinkedWork {
  id: string;
  title: string;
}

interface SkillEvidenceBadgeProps {
  userSkillId: string;
  skillName: string;
  proficiency?: string | null;
  endorsementsCount?: number;
  linkedWorks?: LinkedWork[];
  canEndorse?: boolean;
}

export default function SkillEvidenceBadge({
  userSkillId,
  skillName,
  proficiency,
  endorsementsCount = 0,
  linkedWorks = [],
  canEndorse = false,
}: SkillEvidenceBadgeProps) {
  const [count, setCount] = useState(endorsementsCount);
  const [endorsed, setEndorsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEndorse = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEndorse || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (!endorsed) {
        const res = await fetch('/api/skills/endorse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userSkillId }),
        });
        if (res.ok) {
          setEndorsed(true);
          setCount((prev) => prev + 1);
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to endorse');
        }
      } else {
        const res = await fetch(`/api/skills/endorse?userSkillId=${encodeURIComponent(userSkillId)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setEndorsed(false);
          setCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch {
      alert('Endorsement action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border)] text-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-[var(--text-primary)] truncate">
            {skillName}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] border-l border-[var(--border)] pl-1.5 shrink-0 font-mono">
            {proficiency || 'self-declared'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {count > 0 && (
            <span className="text-[10px] font-mono font-bold text-[var(--highlight)] bg-[var(--highlight)]/10 px-1.5 py-0.5 rounded">
              +{count}
            </span>
          )}

          {canEndorse && (
            <button
              type="button"
              onClick={handleEndorse}
              disabled={isSubmitting}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                endorsed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
              title={endorsed ? 'Remove endorsement' : 'Endorse this skill'}
            >
              {endorsed ? <Check className="w-2.5 h-2.5" /> : <ThumbsUp className="w-2.5 h-2.5" />}
              <span>{endorsed ? 'Endorsed' : 'Endorse'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Linked Demonstrating Works Evidence */}
      {linkedWorks.length > 0 && (
        <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] flex-wrap">
          <span className="text-zinc-500">Evidence:</span>
          {linkedWorks.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="inline-flex items-center gap-0.5 text-[var(--accent-fg)] hover:underline truncate max-w-[160px]"
            >
              <span>{work.title}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
