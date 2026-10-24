'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, Zap, Info, CheckCircle2 } from 'lucide-react';
import FolderFloat from '@/components/ui/FolderFloat';

export interface ProfileSkillData {
  id?: string;
  name?: string;
  skill?: {
    name: string;
    category?: string;
  } | null;
  proficiency?: string | null;
  endorsements_count?: number;
}

export interface ProfileSkillsFolderProps {
  skills: (ProfileSkillData | string)[];
  title?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function ProfileSkillsFolder({
  skills,
  title = 'Verified Technical Competencies',
  variant = 'light',
  className = ''
}: ProfileSkillsFolderProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'folder' | 'grid'>('folder');

  if (!skills || skills.length === 0) {
    return (
      <div className={`p-4 rounded-xl border ${variant === 'dark' ? 'bg-[#1C1F26]/60 border-white/[0.08] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'} text-xs`}>
        No verified skills published yet.
      </div>
    );
  }

  // Normalize skill names
  const normalizedSkills = skills.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `skill-${idx}`,
        name: item,
        proficiency: 'Verified',
        endorsements: 0
      };
    }
    const name = item.skill?.name || item.name || 'Competency';
    return {
      id: item.id || `skill-${idx}`,
      name,
      proficiency: item.proficiency || 'Verified',
      endorsements: item.endorsements_count || 0
    };
  });

  const folderItems = normalizedSkills.map(s => ({
    label: `#${s.name}`,
    value: s.name
  }));

  const isDark = variant === 'dark';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#1b59f8]/10 text-[#1b59f8]'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {title}
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Interactive Zero-Gravity Skill Cloud &bull; {normalizedSkills.length} competencies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-xs">
          <button
            type="button"
            onClick={() => setViewMode('folder')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'folder'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Floating Folder
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All Badges
          </button>
        </div>
      </div>

      {viewMode === 'folder' ? (
        <div
          className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden transition-all min-h-[340px] sm:min-h-[380px] ${
            isDark
              ? 'bg-gradient-to-b from-[#111622] to-[#0b0f17] border-white/[0.08] shadow-2xl'
              : 'bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30 border-slate-200/80 shadow-sm'
          }`}
        >
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-6 left-1/3 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl" />
          </div>

          {/* Interactive Hint */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] pointer-events-none z-10">
            <span className={`inline-flex items-center gap-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Hover or click folder to launch skills &bull; Drag & throw pills in 2D gravity!
            </span>
            {selectedSkill && (
              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-blue-100 text-[#1b59f8] border border-blue-200'}`}>
                <CheckCircle2 className="w-3 h-3" />
                Selected: #{selectedSkill}
              </span>
            )}
          </div>

          {/* Floating Physics Folder */}
          <div className="pt-24 sm:pt-28 pb-4 flex justify-center w-full">
            <FolderFloat
              items={folderItems}
              label={title}
              sublabel={`${normalizedSkills.length} verified notes`}
              trigger="hover"
              physics={true}
              drift={0.65}
              closeOnSelect={false}
              spread={180}
              lift={30}
              tilt={10}
              bounce={0.35}
              width={210}
              height={148}
              folderColor={isDark ? '#1e1b4b' : '#0f172a'}
              frontColor={isDark ? '#3730a3' : '#1b59f8'}
              paperColor={isDark ? '#312e81' : '#ffffff'}
              itemColor={isDark ? '#1e293b' : '#ffffff'}
              itemTextColor={isDark ? '#e2e8f0' : '#0f172a'}
              labelColor="#ffffff"
              onSelect={(val) => {
                setSelectedSkill(String(val));
              }}
            />
          </div>

          {/* Bottom helper text */}
          <p className={`mt-2 text-[10px] text-center font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Zero-Gravity 2D Rigid Body Physics Engine &bull; Touch & Pointer Enabled
          </p>
        </div>
      ) : (
        /* Static / Flat Grid View with full details */
        <div className="flex flex-wrap gap-2.5 pt-1">
          {normalizedSkills.map((s) => (
            <div
              key={s.id}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:border-indigo-400/40 hover:bg-white/[0.08]'
                  : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:border-[#1b59f8]/40 hover:shadow'
              }`}
            >
              <span className={isDark ? 'text-indigo-400' : 'text-[#1b59f8]'}>#</span>
              <span>{s.name}</span>
              {s.proficiency && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-white/[0.08] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {s.proficiency}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
