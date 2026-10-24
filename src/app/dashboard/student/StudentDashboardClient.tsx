'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRole, ROLE_PERSONAS } from '@/lib/auth/role-context';
import {
  FileText,
  ExternalLink,
  Plus,
  Video,
  Eye,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Trophy,
  Sparkles,
  Users,
} from 'lucide-react';
import { Work, Profile } from '@/lib/types';
import CertificatesBadgesSection from '@/components/profile/CertificatesBadgesSection';
import AchievementsPostsSection from '@/components/profile/AchievementsPostsSection';
import CollabRequestsSection from '@/components/dashboard/CollabRequestsSection';
import {
  getStoredCertificates,
  getStoredAchievements,
} from '@/lib/data/profile-achievements';
import {
  getReceivedRequests,
  getSentRequests,
  CONNECTIONS_EVENT,
} from '@/lib/connections/connection-store';
import DashboardSessionGuard from '@/components/auth/DashboardSessionGuard';

interface StudentDashboardClientProps {
  myWorks: Work[];
  profiles?: Profile[];
  userId?: string;
  studentProfile?: Profile | null;
}

export default function StudentDashboardClient({
  myWorks: initialWorks,
  userId,
  studentProfile,
}: StudentDashboardClientProps) {
  const { currentUser: authUser } = useRole();
  const currentUser = authUser || ROLE_PERSONAS.student;
  const works = initialWorks;

  // Determine effective profile identity
  const effectiveProfileId =
    userId ||
    studentProfile?.id ||
    (authUser?.id && authUser.id !== 'user-student'
      ? authUser.id
      : '4adab108-bcfd-43f4-9686-645a23f2fda7');

  const effectiveProfileName =
    studentProfile?.display_name ||
    currentUser.name ||
    'Ragav S';

  const effectiveProfileHeadline =
    studentProfile?.headline ||
    studentProfile?.field ||
    currentUser.title ||
    'Autonomous Robotics & Deep Learning Researcher';

  const effectiveProfileAvatar =
    studentProfile?.avatar_url ||
    currentUser.avatar ||
    '';

  const [activeTab, setActiveTab] = useState<'works' | 'certificates' | 'achievements' | 'requests'>('works');
  const [certCount, setCertCount] = useState<number>(2);
  const [postCount, setPostCount] = useState<number>(1);
  const [receivedCount, setReceivedCount] = useState<number>(1);
  const [sentCount, setSentCount] = useState<number>(0);

  // Sync counts on mount and when storage/connection updates occur
  useEffect(() => {
    const updateCounts = () => {
      const certs = getStoredCertificates(effectiveProfileId);
      const posts = getStoredAchievements(effectiveProfileId);
      setCertCount(certs.length);
      setPostCount(posts.length);

      const rec = getReceivedRequests();
      const snt = getSentRequests();
      setReceivedCount(rec.length);
      setSentCount(snt.length);
    };

    updateCounts();

    const handleCredentialsUpdated = () => {
      updateCounts();
    };

    window.addEventListener('csc-credentials-updated', handleCredentialsUpdated);
    window.addEventListener(CONNECTIONS_EVENT, handleCredentialsUpdated);
    window.addEventListener('storage', handleCredentialsUpdated);
    return () => {
      window.removeEventListener('csc-credentials-updated', handleCredentialsUpdated);
      window.removeEventListener(CONNECTIONS_EVENT, handleCredentialsUpdated);
      window.removeEventListener('storage', handleCredentialsUpdated);
    };
  }, [effectiveProfileId]);

  // Support reading initial tab from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'certificates' || tabParam === 'badges') {
        setActiveTab('certificates');
      } else if (tabParam === 'achievements' || tabParam === 'posts') {
        setActiveTab('achievements');
      } else if (tabParam === 'requests' || tabParam === 'collab' || tabParam === 'connections') {
        setActiveTab('requests');
      }
    }
  }, []);

  const scrollToHub = (tab: 'works' | 'certificates' | 'achievements' | 'requests') => {
    setActiveTab(tab);
    const element = document.getElementById('portfolio-credentials-hub');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Session Security Guard: Disables browser back/previous button on authenticated dashboard */}
      <DashboardSessionGuard />

      {/* ── TOP HERO BANNER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Soft subtle glow wash */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1b59f8]/20 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200/80">
                  Verified Student Builder
                </span>
                <span className="text-xs font-mono text-slate-500">
                  @iisc.ac.in • IISc Bangalore
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
                Your proof of work and accredited badges are verified across campus. 3 Tier-1 recruiters inspected your repositories this week.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/works/new"
              className="px-4 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Proof</span>
            </Link>

            <button
              onClick={() => scrollToHub('certificates')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
                activeTab === 'certificates'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'certificates' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Add Certificate</span>
            </button>

            <button
              onClick={() => scrollToHub('achievements')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
                activeTab === 'achievements'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            >
              <Trophy className={`w-4 h-4 ${activeTab === 'achievements' ? 'text-white' : 'text-amber-500'}`} />
              <span>Post Achievement</span>
            </button>

            <button
              onClick={() => scrollToHub('requests')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
                activeTab === 'requests'
                  ? 'bg-[#1b59f8] text-white'
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'requests' ? 'text-white' : 'text-[#1b59f8]'}`} />
              <span>Collab Requests</span>
              {receivedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                  {receivedCount}
                </span>
              )}
            </button>

            <Link
              href="/cv"
              className="px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#1b59f8]" />
              <span>ATS CV Studio</span>
            </Link>

            <Link
              href={`/profile/${effectiveProfileId}`}
              className="px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Portfolio Status</p>
              <p className="text-xs font-bold text-slate-800">Live &amp; Recruiter-Discoverable</p>
            </div>
          </div>
          <button
            onClick={() => scrollToHub('certificates')}
            className="flex items-center gap-2.5 text-left group hover:opacity-80 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Licenses &amp; Badges</p>
              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1">
                <span>{certCount} Verified Credentials</span>
                <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </button>
          <button
            onClick={() => scrollToHub('achievements')}
            className="flex items-center gap-2.5 text-left group hover:opacity-80 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Milestone Posts</p>
              <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700 flex items-center gap-1">
                <span>{postCount} Photo Achievements</span>
                <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </button>
          <button
            onClick={() => scrollToHub('requests')}
            className="flex items-center gap-2.5 text-left group hover:opacity-80 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Collab Requests</p>
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1">
                <span>{receivedCount} Incoming • {sentCount} Sent</span>
                <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── BENTO TILES ROW 1: ATS GAUGE & RECRUITER RADAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TILE 1: ATS SCORE GAUGE */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1b59f8] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Checklist Status</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                CHECKLIST PASSING
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Standard Section Headings</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Present</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contact Information &amp; Links</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Validated</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Date Format Consistency</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Standard</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified Campus Works Attached</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Linked</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 leading-relaxed font-sans">
              Rule-based checks confirm your resume uses standard headings and single-column formatting without unverified score assumptions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/cv"
              className="text-xs font-bold text-[#1b59f8] hover:text-[#174ed8] transition-colors flex items-center gap-1.5"
            >
              <span>Tune in CV Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-[11px] font-mono text-slate-400">
              Updated 2 days ago
            </span>
          </div>
        </div>

        {/* TILE 2: RECRUITER VIEWS & INQUIRIES (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Recruiter Inquiries &amp; Portfolio Activity
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                +28% Recruiter Engagement
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Recruiter Card 1 */}
              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        MC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Marcus Chen</p>
                        <p className="text-[10px] text-slate-500">Senior Talent Partner @ Stripe</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      INQUIRY
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 italic">
                    &ldquo;Saw your Redis architecture and benchmark graphs. We&apos;re hiring for Distributed Systems New Grads. Would love to connect!&rdquo;
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">2 hours ago</span>
                  <Link
                    href="/messages"
                    className="text-xs font-bold text-[#1b59f8] hover:underline flex items-center gap-1"
                  >
                    <span>Reply in Messages</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Recruiter Card 2 */}
              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1b59f8] font-bold text-xs flex items-center justify-center">
                        SC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Sarah Chen</p>
                        <p className="text-[10px] text-slate-500">Engineering Lead @ Google Cloud</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-[#1b59f8] font-bold">
                      PROFILE VIEW
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600">
                    Inspected your WebRTC low-latency audio transmission project and verified your GitHub repository commits.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">Yesterday</span>
                  <Link
                    href="/people"
                    className="text-xs font-bold text-[#1b59f8] hover:underline flex items-center gap-1"
                  >
                    <span>View Scout Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span>Recent searches matching your profile: <strong className="text-slate-800">Redis, Next.js 16, Distributed Systems, WebRTC</strong></span>
            <Link href="/showcase" className="text-[#1b59f8] font-semibold hover:underline shrink-0">
              See what recruiters see &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── BENTO TILES ROW 2: PORTFOLIO & CREDENTIALS COMMAND CENTER ── */}
      <div id="portfolio-credentials-hub" className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-6 scroll-mt-24">
        {/* Hub Header with Profile-style Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold">
                Student Profile Activity Hub
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                LinkedIn Mode
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <span>Showcase, Credentials &amp; Milestones</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your verified code repositories, accredited certifications, and photo milestone updates for {effectiveProfileName}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {activeTab === 'works' && (
              <Link
                href="/works/new"
                className="px-4 py-2 rounded-full bg-[#0f172a] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Work</span>
              </Link>
            )}
            <Link
              href={`/profile/${effectiveProfileId}`}
              className="text-xs font-bold text-[#1b59f8] hover:text-[#174ed8] px-3.5 py-2 rounded-full bg-blue-50/70 hover:bg-blue-100/70 transition-all flex items-center gap-1.5"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Tab 1: Proofs of Work */}
            <button
              onClick={() => setActiveTab('works')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'works'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1b59f8]" />
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

            {/* Tab 2: Licenses & Badges (Certificates) */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'certificates'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Licenses &amp; Badges</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full ${
                  activeTab === 'certificates'
                    ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {certCount}
              </span>
            </button>

            {/* Tab 3: Achievements & Posts */}
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Achievements &amp; Posts</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            {/* Tab 4: Collab & Connection Requests */}
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'requests'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#1b59f8]" />
              <span>Collab Requests</span>
              {(receivedCount > 0 || sentCount > 0) && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full ${
                    activeTab === 'requests'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {receivedCount + sentCount}
                </span>
              )}
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden lg:block pr-2">
            Accredited Badges &amp; Milestone Feed
          </div>
        </div>

        {/* Tab 1 Content: Works */}
        {activeTab === 'works' && (
          <div className="space-y-4">
            {works.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl bg-[#f8fafc] border border-dashed border-slate-300 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1b59f8] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Welcome to your Student Command Center!</h3>
                  <p className="text-xs text-slate-500">
                    You haven&apos;t published a proof of work yet. Publish your first project repository, technical paper, or benchmark to start getting recruiter visibility.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    href="/works/new"
                    className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish First Proof</span>
                  </Link>
                  <Link
                    href="/showcase"
                    className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    Explore Showcase
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-[#1b59f8]/40 hover:bg-white transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1b59f8] border border-blue-200 font-bold">
                          {work.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{work.views_count || 120}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#1b59f8] transition-colors line-clamp-2">
                        {work.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {work.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Repo</span>
                      </div>

                      <Link
                        href={`/works/${work.id}`}
                        className="text-xs font-bold text-slate-700 hover:text-[#1b59f8] flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Licenses & Badges (CertificatesBadgesSection) */}
        {activeTab === 'certificates' && (
          <div className="pt-2">
            <CertificatesBadgesSection
              profileId={effectiveProfileId}
              profileName={effectiveProfileName}
              isOwner={true}
            />
          </div>
        )}

        {/* Tab 3 Content: Achievements & Photo Posts (AchievementsPostsSection) */}
        {activeTab === 'achievements' && (
          <div className="pt-2">
            <AchievementsPostsSection
              profileId={effectiveProfileId}
              profileName={effectiveProfileName}
              profileHeadline={effectiveProfileHeadline}
              profileAvatar={effectiveProfileAvatar}
              isOwner={true}
            />
          </div>
        )}

        {/* Tab 4 Content: Collab & Connection Requests Hub */}
        {activeTab === 'requests' && (
          <div className="pt-2">
            <CollabRequestsSection />
          </div>
        )}
      </div>

      {/* ── BENTO TILES ROW 3: REAL-TIME COLLAB & HACKATHONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLLAB SPRINT ROOMS */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Live Campus Collab Sprints
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                WebRTC SFU Active
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Join interactive, zero-latency pair programming rooms with verified peers from your campus.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Distributed Consensus (Raft in Rust)</h4>
                  <p className="text-[11px] text-slate-500 font-mono">3 Builders inside • Audio &amp; Screen sharing</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  Join Room
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Turbopack &amp; Next.js 16 Internal Sprint</h4>
                  <p className="text-[11px] text-slate-500 font-mono">2 Builders inside • Code editor active</p>
                </div>
                <Link
                  href="/collaborate"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  Join Room
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/collaborate"
              className="w-full py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Collab Sprint Room</span>
            </Link>
          </div>
        </div>

        {/* HACKATHON & FELLOWSHIP OPPORTUNITIES */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Recommended High-Signal Challenges
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Tier-1 Sponsored</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                    $25,000 BOUNTY
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">Global Edge Systems Hackathon</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Build low-latency caching and distributed sync solutions. Winners get direct interviews at Stripe &amp; Cloudflare.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-black shrink-0 mt-1">
                  Apply
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                    RESEARCH GRANT
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">IISc Deeptech Demo Day 2026</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Present student proof-of-work before leading venture partners and tech founders.
                  </p>
                </div>
                <button className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-black shrink-0 mt-1">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Matched to your skills: <strong className="text-slate-800">Redis, Next.js, Rust</strong></span>
            <Link href="/showcase" className="text-[#1b59f8] font-semibold hover:underline">
              Explore All Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
