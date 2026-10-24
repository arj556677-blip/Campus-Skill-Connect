'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShieldAlert, X } from 'lucide-react';

/**
 * DashboardSessionGuard
 * 
 * Enterprise Session Security Mechanism:
 * Disables and intercepts browser previous/back-button navigation strictly on authenticated
 * dashboard environments (/dashboard, /dashboard/student, /dashboard/recruiter, /admin).
 * 
 * Prevents session leakage, bfcache exposure of login credentials, and unauthorized re-entry.
 * On public / non-dashboard routes (e.g. /showcase, /profile/[id]), normal back navigation remains enabled.
 */
export default function DashboardSessionGuard() {
  const pathname = usePathname();
  const [blockedAttemptNotice, setBlockedAttemptNotice] = useState(false);

  useEffect(() => {
    // Strictly isolate only to authenticated dashboards
    const isDashboardRoute =
      pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

    if (!isDashboardRoute) {
      return;
    }

    const hasSession =
      typeof window !== 'undefined' &&
      (localStorage.getItem('csc_session') === 'active' ||
        document.cookie.includes('csc_session=active'));

    if (!hasSession) {
      return;
    }

    // 1. Establish guard state in browser history stack
    try {
      window.history.pushState(null, '', window.location.href);
    } catch {}

    // 2. Intercept popstate (browser Previous / Back button action) in capturing phase
    const handlePopState = (event: PopStateEvent) => {
      // Force the browser forward back to dashboard immediately
      try {
        window.history.forward();
        window.history.pushState(null, '', window.location.href);
      } catch {}

      // Display security notice to user
      setBlockedAttemptNotice(true);
      const timer = setTimeout(() => {
        setBlockedAttemptNotice(false);
      }, 4000);

      return () => clearTimeout(timer);
    };

    // 3. Prevent back-forward cache (bfcache) session restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        try {
          window.history.forward();
          window.history.pushState(null, '', window.location.href);
        } catch {}
      }
    };

    // Attach in capturing phase to intercept before Next.js router
    window.addEventListener('popstate', handlePopState, true);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', handlePopState, true);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [pathname]);

  if (!blockedAttemptNotice) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-[99999] max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="p-4 rounded-2xl bg-[#0f172a] text-white border border-slate-700 shadow-2xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-tight">
              Session Navigation Locked
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 border border-blue-500/40">
              OWASP Guard
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Previous page navigation is disabled on your authenticated dashboard to prevent login session leakage and credential re-submission.
          </p>
        </div>
        <button
          onClick={() => setBlockedAttemptNotice(false)}
          className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 transition-colors"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
