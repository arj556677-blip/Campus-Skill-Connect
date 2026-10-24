'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import {
  ArrowUpRight,
  Compass,
  Plus,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function HomeHeroCTAs() {
  const { isLoggedIn, isMounted, currentUser } = useRole();

  if (isMounted && isLoggedIn && currentUser) {
    const dashboardHref = currentUser.dashboardUrl || '/dashboard';
    const isStudent = currentUser.role === 'student';

    return (
      <div className="w-full flex flex-col items-start">
        {/* Dynamic Logged-in Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-xs font-semibold text-[#1b59f8] mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Welcome back, <strong className="font-bold">{currentUser.name}</strong> • Active Workspace ({currentUser.roleLabel || 'Builder'})
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.08]">
          Shape Your Future with the{' '}
          <span className="text-[#1b59f8]">Right Proof</span> of Work
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-normal">
          Your campus command center is active. Access your verified repositories, accredited credentials, and live sprint rooms, or share new proof of work with recruiters.
        </p>

        {/* Action Buttons: Tailored for Logged-In User */}
        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <Link
            href={dashboardHref}
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-sm font-bold shadow-md active:scale-95 transition-all group"
          >
            <LayoutDashboard className="w-4 h-4 text-white" />
            <span>GO TO DASHBOARD</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>

          {isStudent ? (
            <Link
              href="/works/new"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Share New Proof</span>
            </Link>
          ) : (
            <Link
              href="/recruiter/search"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Explore Talent</span>
            </Link>
          )}

          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Explore Showcase</span>
          </Link>
        </div>

        {/* Micro Proof Elements */}
        <div className="mt-10 flex items-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Identity Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1b59f8]" />
            <span>Portfolio Recruiter-Visible</span>
          </div>
        </div>
      </div>
    );
  }

  // Default / Unauthenticated View
  return (
    <div className="w-full flex flex-col items-start">
      {/* Kicker Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-6 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#1b59f8] animate-pulse" />
        <span>#1 Campus Proof-of-Work Platform 2026</span>
      </div>

      {/* Bold Display Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight leading-[1.08]">
        Shape Your Future with the{' '}
        <span className="text-[#1b59f8]">Right Proof</span> of Work
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-normal">
        Discover a high-trust campus proof-of-work ecosystem. Empower yourself to succeed in your career, passions, and peer collaborations through verifiable repositories, research, and design.
      </p>

      {/* Action Buttons: Black Pill CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-3.5">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold shadow-md active:scale-95 transition-all group"
        >
          <span>GET STARTED</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </Link>

        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4 text-slate-600" />
          <span>Explore Showcase</span>
        </Link>
      </div>

      {/* Micro Proof Elements */}
      <div className="mt-10 flex items-center gap-6 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verified Domain Identity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>100% Free for Students</span>
        </div>
      </div>
    </div>
  );
}
