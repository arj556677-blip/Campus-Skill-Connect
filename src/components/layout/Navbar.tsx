'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole, UserRoleType } from '@/lib/auth/role-context';
import {
  Compass,
  Users,
  Video,
  FileText,
  Sparkles,
  Briefcase,
  Plus,
  MessageSquare,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  User,
  LogOut,
  CircleHelp as HelpCircle,
  LayoutDashboard,
  GraduationCap,
  ArrowRight,
  LogIn,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, isMounted, currentRole, currentUser, switchRole, signOut } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 'Hub', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
    { label: 'Showcase', href: '/showcase', icon: Compass },
    { label: 'Talent Directory', href: '/people', icon: Users },
    { label: 'Collab Rooms', href: '/collaborate', icon: Video, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { label: 'CV Studio', href: '/cv', icon: FileText, badge: 'ATS', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { label: 'AI Copilot', href: '/copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { label: 'Recruiter Hub', href: '/recruiter/search', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0d0f17]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_0_rgba(0,0,0,0.6)] py-2.5 px-4 sm:px-6'
            : 'bg-[#0d0f17]/70 backdrop-blur-md border border-white/[0.07] shadow-lg py-3 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-transform duration-200 group-hover:scale-105">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                Campus Skill Connect
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold uppercase tracking-wider">
                  V2.0
                </span>
              </span>
              <span className="text-[11px] text-zinc-400 font-medium -mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Proof-of-Skill Campus Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/15 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Center */}
          <div className="flex items-center gap-2.5">
            {/* Post Work CTA */}
            <Link
              href="/works/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Share Work</span>
            </Link>

            {/* Direct Messages Shortcut (only if logged in) */}
            {isMounted && isLoggedIn && (
              <Link
                href="/messages"
                title="In-App Real-time Messages"
                className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#0d0f17]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Conditional Auth State: User Profile vs Log In */}
            {isMounted && isLoggedIn && currentUser ? (
              /* User Profile & Dropdown (When Logged In) */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  <div
                    className={`w-6 h-6 rounded-lg text-white flex items-center justify-center font-bold text-[10px] shadow-sm ${
                      currentRole === 'admin'
                        ? 'bg-gradient-to-tr from-rose-600 to-orange-500'
                        : currentRole === 'student'
                        ? 'bg-gradient-to-tr from-violet-600 to-cyan-500'
                        : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                    }`}
                  >
                    {currentUser.initials}
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-xs font-medium text-zinc-200">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase border font-bold ${
                        currentRole === 'admin'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : currentRole === 'student'
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {currentRole === 'admin' ? 'Admin' : currentRole === 'student' ? 'Student' : 'Recruiter'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#12141f] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl"
                  >
                    <div className="px-3 py-2.5 border-b border-white/[0.08]">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{currentUser.name}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {currentUser.title}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    {/* Switch Role Quick Bar */}
                    <div className="p-2 border-b border-white/[0.08] bg-black/20 rounded-xl my-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">
                        Switch Active Persona:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['admin', 'student', 'recruiter'] as UserRoleType[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              switchRole(r, true);
                              setUserDropdownOpen(false);
                            }}
                            className={`py-1 px-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                              currentRole === r
                                ? r === 'admin'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                  : r === 'student'
                                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            {r === 'admin' ? 'Admin' : r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={currentUser.dashboardUrl}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-xl transition-colors mb-1"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                          <span>Go to {currentRole === 'admin' ? 'Admin' : currentRole === 'student' ? 'Student' : 'Recruiter'} Dashboard</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                      </Link>

                      {currentRole === 'student' && (
                        <Link
                          href="/profile/me"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          View Public Portfolio
                        </Link>
                      )}

                      {currentRole === 'recruiter' && (
                        <Link
                          href="/recruiter/search"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                          Candidate Search Radar
                        </Link>
                      )}

                      <Link
                        href="/connections"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        Campus Network & Connections
                      </Link>

                      <Link
                        href="/support"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                        Help & Support Desk
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-white/[0.08]">
                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* When NOT Logged In: Show Log In & Sign Up buttons ONLY */
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 shadow-md active:scale-95 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold transition-all"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.06]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                href="/works/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-glow-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Share New Work</span>
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold"
              >
                <LogIn className="w-4 h-4 text-violet-400" />
                <span>Log In (Customized Views)</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
