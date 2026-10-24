export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Layers,
  FileCheck,
  Lock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import WorkCard from '@/components/cards/WorkCard';
import { getWorks, getCommunities } from '@/lib/data/service';
import { getUser } from '@/lib/supabase/server';
import HomeHeroActions from '@/components/home/HomeHeroActions';
import HeroVisualCard from '@/components/home/HeroVisualCard';

export default async function HomePage() {
  const user = await getUser();
  const works = await getWorks();
  const communities = await getCommunities();

  return (
    <div className="flex flex-col w-full bg-white text-[#0f172a] selection:bg-[#1b59f8]/20 selection:text-[#1b59f8]">
      {/* ── 1. HERO SECTION: 2-Column Responsive Layout ── */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Headline, Subtitle, Actions & Verification Notes */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Identity Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1b59f8]" />
                <span>Campus Skill Connect (CSC)</span>
              </div>

              {/* Clear Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-[1.12]">
                A Skill-First, Work-First <br className="hidden sm:inline" />
                <span className="text-[#1b59f8]">Campus Platform</span>
              </h1>

              {/* Direct Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Where university students and faculty publish verifiable proof of their technical projects, find peer collaborators matching their skills, and connect with academic peers and recruiters.
              </p>

              {/* Action Buttons: Dynamically adapts to Logged In vs Guest */}
              <HomeHeroActions
                initialIsLoggedIn={Boolean(user)}
                initialRole={user?.user_metadata?.role || 'student'}
                align="left"
              />

              {/* Core Verification Notes */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified University Email Domains</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real GitHub &amp; Research Links</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Unverified Resumes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Portrait & Badges */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
              <HeroVisualCard />
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. WHAT OUR WEBSITE DOES (Real Capabilities) ── */}
      <section className="py-16 sm:py-20 bg-[#f8fafc] border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1b59f8] font-bold">
              Product Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1 tracking-tight">
              What Campus Skill Connect Does
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Designed to solve the problem of unverified claims by connecting genuine student work directly to peers and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1b59f8] group-hover:scale-110 group-hover:bg-[#1b59f8] group-hover:text-white transition-all duration-300 flex items-center justify-center mb-4">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">Link-First Proof of Work</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Publish real GitHub code repositories, research papers, and technical blueprints with safe link previews. No fake assertions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Peer-reviewable artifacts
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Skill-Matched Collaborations</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Discover student teams needing your exact skills (e.g. React, Python, Rust, ML) for hackathons, papers, and campus projects.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Targeted role matching
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Connections &amp; Messages</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Send connection requests to peers and mentors, communicate in real time, and form cross-department project teams.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Consent-based messaging
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">4-Level Privacy Control</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  PostgreSQL Row Level Security enforces visibility across Only Me, Connections, Campus, and Public. Zero unauthorized data leaks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Database-enforced privacy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW THE USER FLOW WORKS (Simple 3 Steps) ── */}
      <section className="py-16 sm:py-20 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1b59f8] font-bold">
              User Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1 tracking-tight">
              Simple, Straightforward Flow
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              No complicated hoops or fake steps. Just three simple stages from sign-up to campus collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs mb-4 group-hover:scale-110 group-hover:bg-[#1b59f8] transition-all duration-200">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">Sign Up &amp; Verify Email</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Enter your details to receive a 6-digit one-time verification code (OTP) at your email address. Verify the code to securely confirm your account.
              </p>
              <div className="mt-4">
                {user ? (
                  <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Account Active &amp; Verified</span>
                  </span>
                ) : (
                  <Link
                    href="/sign-up"
                    className="group/link text-xs font-bold text-[#1b59f8] hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Start registration</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="group p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-[#1b59f8] text-white flex items-center justify-center font-bold text-xs mb-4 group-hover:scale-110 transition-transform duration-200">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1b59f8] transition-colors">Add Profile Details &amp; Skills</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add your profile picture, university institution, technical skills, and collaboration preferences so peers can discover what you build.
              </p>
              <div className="mt-4">
                <Link
                  href="/profile/edit"
                  className="group/link text-xs font-bold text-[#1b59f8] hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View profile settings</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-4 group-hover:scale-110 transition-transform duration-200">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Dashboard &amp; Collaboration</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your dashboard matches you to open collaboration roles matching your skills, displays your profile on the right, and lets you manage messages and connection requests.
              </p>
              <div className="mt-4">
                <Link
                  href={
                    user?.user_metadata?.role === 'admin'
                      ? '/admin'
                      : user?.user_metadata?.role === 'recruiter'
                      ? '/dashboard/recruiter'
                      : '/dashboard/student'
                  }
                  className="group/link text-xs font-bold text-[#1b59f8] hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Open your dashboard</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. RECENT VERIFIED WORKS (Real Evidence) ── */}
      <section className="py-16 sm:py-20 border-b border-slate-100 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1b59f8] font-bold">
                Public Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1 tracking-tight">
                Recent Verified Works
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Real student repositories, papers, and systems verified on campus.
              </p>
            </div>

            <Link
              href="/showcase"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#1b59f8] hover:text-blue-700 transition-colors"
            >
              <span>Explore all works</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.slice(0, 6).map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ACCREDITED CAMPUS INSTITUTIONS ── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-6">
            Participating Accredited Universities &amp; Institutes
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8fafc] hover:bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs transition-all duration-200 cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{comm.name}</span>
                <span className="text-[10px] font-mono text-slate-400">({comm.domain})</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 max-w-4xl mx-auto">
            <span>© 2026 Campus Skill Connect (CSC). Digital Personal Data Protection (DPDP) Act 2023 Compliant.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-800 hover:underline transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-800 hover:underline transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-slate-800 hover:underline transition-colors">Help &amp; Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
