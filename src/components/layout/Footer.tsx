'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Server, Database } from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

export default function Footer() {
  const { currentRole, isLoggedIn, isMounted } = useRole();
  const isAdmin = isMounted && isLoggedIn && currentRole === 'admin';

  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#f8fafc] text-slate-800">
      {/* Infrastructure Telemetry Bar — Visible strictly to Platform Administrators only */}
      {isAdmin && (
        <div className="border-b border-slate-200/80 bg-white py-3 px-4 text-xs font-mono animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-500">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Redis 7: In-Memory Cache-Aside &amp; PubSub Active
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:flex items-center gap-1.5 text-slate-600">
                <Server className="w-3.5 h-3.5 text-blue-600" />
                NGINX 1.25 Edge Proxy &amp; Rate Zones Ready
              </span>
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-slate-600">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                PostgreSQL 15 + RLS 23 Tables
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-bold font-mono">
                Multi-Campus Federation Active
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                CS
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Campus Skill Connect
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 max-w-sm leading-relaxed">
              The high-trust, proof-of-work campus network connecting verified student engineers, researchers, and creators with peers, faculty, and corporate recruiters.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Granular visibility control &amp; DPDP Act 2023 aligned</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/showcase" className="hover:text-[#1b59f8] transition-colors">
                  Work Showcase
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-[#1b59f8] transition-colors">
                  Talent Directory
                </Link>
              </li>
              <li>
                <Link href="/communities" className="hover:text-[#1b59f8] transition-colors">
                  Campus Colleges
                </Link>
              </li>
              <li>
                <Link href="/zones" className="hover:text-[#1b59f8] transition-colors">
                  City Innovation Zones
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & AI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
              Tools & AI Studio
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/cv/builder" className="hover:text-[#1b59f8] transition-colors">
                  Interactive CV Builder
                </Link>
              </li>
              <li>
                <Link href="/cv/upload" className="hover:text-[#1b59f8] transition-colors">
                  Resume ATS Scanner
                </Link>
              </li>
              <li>
                <Link href="/copilot" className="hover:text-[#1b59f8] transition-colors">
                  Career AI Copilot
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="hover:text-[#1b59f8] transition-colors">
                  Live Sprint Collab Rooms
                </Link>
              </li>
              <li>
                <Link href="/recruiter/search" className="hover:text-[#1b59f8] transition-colors">
                  Recruiter Match Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                {isAdmin ? (
                  <Link href="/admin" className="hover:text-[#1b59f8] transition-colors">
                    Admin &amp; Audit Log
                  </Link>
                ) : (
                  <Link href="/support" className="hover:text-[#1b59f8] transition-colors">
                    Support &amp; Safety Guide
                  </Link>
                )}
              </li>
              <li>
                <Link href="/support" className="hover:text-[#1b59f8] transition-colors">
                  Support Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1b59f8] transition-colors font-medium flex items-center gap-1.5">
                  <span>Privacy Policy</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">DPDP</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1b59f8] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/profile/privacy" className="hover:text-[#1b59f8] transition-colors">
                  Privacy Dashboard
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-semibold">
                  v2.4.0 Production
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Campus Skill Connect. Engineered for student creators and developers.</p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/privacy" className="hover:text-[#1b59f8] transition-colors">
              Privacy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terms" className="hover:text-[#1b59f8] transition-colors">
              Terms
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/profile/privacy" className="hover:text-[#1b59f8] transition-colors">
              Data Rights
            </Link>
            {isAdmin && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Next.js 16 • Redis 7 • PostgreSQL 15 • NGINX
                </span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              DPDP Act 2023 Aligned
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
