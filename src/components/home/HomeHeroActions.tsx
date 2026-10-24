'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import { ArrowRight, LayoutDashboard, Plus, Compass } from 'lucide-react';

interface HomeHeroActionsProps {
  initialIsLoggedIn?: boolean;
  initialRole?: string;
}

export default function HomeHeroActions({
  initialIsLoggedIn = false,
  initialRole = 'student',
}: HomeHeroActionsProps) {
  const { isLoggedIn, isMounted, currentUser } = useRole();

  // If mounted on client, use live client role state; otherwise fallback to SSR state
  const userLoggedIn = isMounted ? isLoggedIn : initialIsLoggedIn;

  const resolvedRole = currentUser?.role || initialRole || 'student';
  const roleLabel =
    currentUser?.roleLabel ||
    (resolvedRole === 'admin'
      ? 'Admin'
      : resolvedRole === 'recruiter'
      ? 'Recruiter'
      : 'Student');

  const dashboardUrl =
    currentUser?.dashboardUrl ||
    (resolvedRole === 'admin'
      ? '/admin'
      : resolvedRole === 'recruiter'
      ? '/dashboard/recruiter'
      : '/dashboard/student');

  if (userLoggedIn) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={dashboardUrl}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1b59f8] hover:bg-[#174ed8] text-white text-sm font-bold shadow-sm transition-all active:scale-95"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to {roleLabel} Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {resolvedRole !== 'admin' && (
          <Link
            href="/works/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#1b59f8]" />
            <span>Share Work</span>
          </Link>
        )}

        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
        >
          <Compass className="w-4 h-4 text-slate-500" />
          <span>Explore Works</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/sign-up"
        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all active:scale-95"
      >
        <span>Create Account</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all active:scale-95"
      >
        <span>Log In</span>
      </Link>

      <Link
        href="/showcase"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
      >
        <span>Explore Works</span>
      </Link>
    </div>
  );
}
