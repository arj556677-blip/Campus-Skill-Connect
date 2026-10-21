import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Server, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#07080c] text-white">
      {/* Infrastructure Telemetry Bar */}
      <div className="border-b border-white/[0.06] bg-[#0d0e15]/60 py-3 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-zinc-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Redis 7: In-Memory Cache-Aside & PubSub Active
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-zinc-300">
              <Server className="w-3.5 h-3.5 text-violet-400" />
              NGINX 1.25 Edge Proxy & Rate Zones Ready
            </span>
            <span className="hidden md:inline text-zinc-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-zinc-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              PostgreSQL 15 + RLS 23 Tables
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 font-mono">
              Multi-Campus Federation Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                CS
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Campus Skill Connect
              </span>
            </div>
            <p className="mt-3 text-xs text-zinc-400 max-w-sm leading-relaxed">
              The high-trust, proof-of-work campus network connecting verified student engineers, researchers, and creators with peers, faculty, and engineering recruiters.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Granular visibility control & consent-based networking</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 font-mono">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/showcase" className="hover:text-white transition-colors">
                  Work Showcase
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-white transition-colors">
                  Talent Directory
                </Link>
              </li>
              <li>
                <Link href="/communities" className="hover:text-white transition-colors">
                  Campus Colleges
                </Link>
              </li>
              <li>
                <Link href="/zones" className="hover:text-white transition-colors">
                  City Innovation Zones
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & AI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 font-mono">
              Tools & AI Studio
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/cv/builder" className="hover:text-white transition-colors">
                  Interactive CV Builder
                </Link>
              </li>
              <li>
                <Link href="/cv/upload" className="hover:text-white transition-colors">
                  Resume ATS Scanner
                </Link>
              </li>
              <li>
                <Link href="/copilot" className="hover:text-white transition-colors">
                  Career AI Copilot
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="hover:text-white transition-colors">
                  WebRTC Meeting Rooms
                </Link>
              </li>
              <li>
                <Link href="/recruiter/search" className="hover:text-white transition-colors">
                  Recruiter Match Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3 font-mono">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin & Audit Log
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Support Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Privacy & RLS Policies
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                  v2.0.0 Production
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Campus Skill Connect. Engineered for student creators and developers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
              Next.js 16 • Redis 7 • PostgreSQL 15 • NGINX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
