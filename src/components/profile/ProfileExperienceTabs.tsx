'use client';

import React, { useState } from 'react';
import { Work, Profile } from '@/lib/types';
import WorkCard from '@/components/cards/WorkCard';
import CertificatesBadgesSection from './CertificatesBadgesSection';
import AchievementsPostsSection from './AchievementsPostsSection';
import { FolderGit2, Trophy, Award, Sparkles } from 'lucide-react';

interface ProfileExperienceTabsProps {
  profile: Profile;
  works: Work[];
  isOwner?: boolean;
}

export default function ProfileExperienceTabs({
  profile,
  works,
  isOwner = false,
}: ProfileExperienceTabsProps) {
  const [activeTab, setActiveTab] = useState<'works' | 'achievements' | 'certificates'>('works');

  return (
    <div className="space-y-8 pt-4">
      {/* Tab Navigation Bar (LinkedIn Style Profile Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
          {/* Tab 1: Proof of Work */}
          <button
            onClick={() => setActiveTab('works')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'works'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-[#1b59f8]" />
            <span>Proof of Work</span>
            <span
              className={`text-[10px] px-2 py-0.2 rounded-full ${
                activeTab === 'works'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {works.length}
            </span>
          </button>

          {/* Tab 2: Achievements (LinkedIn Photo Posts) */}
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Achievements &amp; Posts</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Tab 3: Certificates & Badges */}
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'certificates'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Licenses &amp; Badges</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:block">
          Profile Activity Hub • LinkedIn Mode
        </div>
      </div>

      {/* Tab 1 Content: Works */}
      {activeTab === 'works' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Verified Proof of Work Repositories
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Submissions, live prototypes, and engineering documentation published by {profile.display_name}.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {works.length} Item{works.length === 1 ? '' : 's'}
            </span>
          </div>

          {works.length === 0 ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">No published work items yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                This creator hasn&apos;t shared public work items yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: Achievements Photo Posts (with likes & comments) */}
      {activeTab === 'achievements' && (
        <AchievementsPostsSection
          profileId={profile.id}
          profileName={profile.display_name}
          profileHeadline={profile.headline || profile.field || 'Student Builder'}
          profileAvatar={profile.avatar_url || ''}
          isOwner={isOwner}
        />
      )}

      {/* Tab 3 Content: Certificates & Badges */}
      {activeTab === 'certificates' && (
        <CertificatesBadgesSection
          profileId={profile.id}
          profileName={profile.display_name}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
