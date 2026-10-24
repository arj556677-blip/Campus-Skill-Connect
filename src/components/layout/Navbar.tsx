'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  User,
  UserCog,
  LogOut,
  CircleHelp as HelpCircle,
  LayoutDashboard,
  ArrowRight,
  LogIn,
  Lock,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, isMounted, currentRole, currentUser, switchRole, signOut } = useRole();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Scroll detection for dynamic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setToolsDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside and escape key handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setToolsDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary navigation links (clean, essential, uncluttered)
  const primaryLinks = [
    { label: 'Showcase', href: '/showcase' },
    { label: 'Talent', href: '/people', requiresAuth: true },
    { label: 'Recruiters', href: '/recruiter/search' },
  ];

  // Secondary suite/tools grouped into an elegant popover dropdown
  const toolsItems = [
    {
      label: 'Collab Rooms',
      desc: 'Live video & real-time pair programming',
      href: '/collaborate',
      icon: Video,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: 'Live',
      requiresAuth: true,
    },
    {
      label: 'CV Studio',
      desc: 'ATS-optimized resume builder from verified work',
      href: '/cv',
      icon: FileText,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      badge: 'ATS',
      requiresAuth: true,
    },
    {
      label: 'AI Copilot',
      desc: 'Skill analysis & portfolio matchmaking assistant',
      href: '/copilot',
      icon: Sparkles,
      accent: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      badge: 'AI',
    },
  ];

  const isToolsActive = toolsItems.some((item) => pathname.startsWith(item.href));

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'bg-white/85 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl py-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:bg-[#1b59f8] transition-all duration-200">
              CS
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-[#1b59f8] transition-colors">
                Campus Skill Connect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Direct primary links */}
            {primaryLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const targetHref =
                isMounted && !isLoggedIn && item.requiresAuth
                  ? `/sign-in?redirect=${encodeURIComponent(item.href)}`
                  : item.href;
              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1b59f8] bg-blue-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {isMounted && !isLoggedIn && item.requiresAuth && (
                    <Lock className="w-3 h-3 text-slate-400" />
                  )}
                </Link>
              );
            })}

            {/* Tools Dropdown (Consolidates Collab, CV, and AI Copilot without clutter) */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isToolsActive || toolsDropdownOpen
                    ? 'text-[#1b59f8] bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-expanded={toolsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-2 z-50 animate-in fade-in slide-from-top-1 duration-150">
                  <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Student &amp; Creator Suite
                    </p>
                  </div>
                  <div className="space-y-1">
                    {toolsItems.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname.startsWith(tool.href);
                      const targetHref =
                        isMounted && !isLoggedIn && tool.requiresAuth
                          ? `/sign-in?redirect=${encodeURIComponent(tool.href)}`
                          : tool.href;
                      return (
                        <Link
                          key={tool.href}
                          href={targetHref}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group ${
                            isActive
                              ? 'bg-blue-50 text-blue-900'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${tool.accent}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {tool.label}
                              </span>
                              {isMounted && !isLoggedIn && tool.requiresAuth ? (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Login</span>
                                </span>
                              ) : tool.badge ? (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                                  {tool.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Shortcut (if logged in) */}
            {isMounted && isLoggedIn && (
              <Link
                href={currentUser?.dashboardUrl || '/dashboard'}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  pathname.startsWith('/dashboard')
                    ? 'text-[#1b59f8] bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Action Center (Right Side) */}
        <div className="flex items-center gap-2.5">
          {/* Primary CTA: Share Work (Only for authenticated members, not admin or logged-out guests) */}
          {isMounted && isLoggedIn && currentRole !== 'admin' && (
            <Link
              href="/works/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Work</span>
            </Link>
          )}

          {/* Messages Notification Button */}
          {isMounted && isLoggedIn && (
            <Link
              href="/messages"
              title="Direct Messages"
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
          )}

          {/* User Profile or Auth Trigger */}
          {!isMounted ? (
            <div className="w-20 h-8 rounded-full bg-slate-100/70 animate-pulse" />
          ) : isLoggedIn && currentUser ? (
            /* Logged-In User Profile Menu */
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div
                  className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] shadow-sm ${
                    currentRole === 'admin'
                      ? 'bg-gradient-to-tr from-rose-600 to-orange-500'
                      : currentRole === 'student'
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      : currentRole === 'faculty'
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                  }`}
                >
                  {currentUser.initials || (currentUser.name || 'U').slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {(currentUser.name || 'Builder').split(' ')[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-[0_20px_48px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* User Profile Info Card */}
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name || 'Campus Member'}</p>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase border font-bold ${
                          currentRole === 'admin'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : currentRole === 'student'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : currentRole === 'faculty'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        {currentRole === 'admin' ? 'Admin' : currentRole === 'student' ? 'Student' : currentRole === 'faculty' ? 'Faculty' : 'Recruiter'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.title}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  </div>

                  {/* Persona Switcher Quick Control */}
                  <div className="p-2 border-b border-slate-100 bg-slate-50 rounded-xl my-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">
                      Switch Role:
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {(['student', 'faculty', 'recruiter', 'admin'] as UserRoleType[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            switchRole(r, true);
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1 px-1 rounded-lg text-[9px] font-semibold capitalize transition-colors text-center ${
                            currentRole === r
                              ? 'bg-[#0f172a] text-white shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          {r === 'faculty' ? 'Faculty' : r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1 space-y-0.5">
                    <Link
                      href={currentUser.dashboardUrl}
                      className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                        <span>Go to Dashboard</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>

                    {(currentRole === 'student' || currentRole === 'faculty') && (
                      <Link
                        href="/profile/me"
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{currentRole === 'faculty' ? 'Academic Profile' : 'Public Portfolio'}</span>
                      </Link>
                    )}

                    {currentRole === 'recruiter' && (
                      <Link
                        href="/recruiter/search"
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Candidate Radar</span>
                      </Link>
                    )}

                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <UserCog className="w-3.5 h-3.5 text-[#1b59f8]" />
                      <span>Edit Profile</span>
                    </Link>

                    <Link
                      href="/messages"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Messages</span>
                    </Link>

                    <Link
                      href="/connections"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Connections</span>
                    </Link>

                    <Link
                      href="/support"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Support Desk</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-Out Actions: Pill button Login/Signup */
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <span>Login / Signup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-4 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Main Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-1">
              Explore
            </p>
            {primaryLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const targetHref =
                isMounted && !isLoggedIn && item.requiresAuth
                  ? `/sign-in?redirect=${encodeURIComponent(item.href)}`
                  : item.href;
              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {isMounted && !isLoggedIn && item.requiresAuth && (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </Link>
              );
            })}
            {isMounted && isLoggedIn && (
              <Link
                href={currentUser?.dashboardUrl || '/dashboard'}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Tools Suite */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-1">
              Creator Suite
            </p>
            {toolsItems.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname.startsWith(tool.href);
              const targetHref =
                isMounted && !isLoggedIn && tool.requiresAuth
                  ? `/sign-in?redirect=${encodeURIComponent(tool.href)}`
                  : tool.href;
              return (
                <Link
                  key={tool.href}
                  href={targetHref}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{tool.label}</span>
                  </div>
                  {isMounted && !isLoggedIn && tool.requiresAuth ? (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Login</span>
                    </span>
                  ) : tool.badge ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                      {tool.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isMounted && isLoggedIn && currentRole !== 'admin' && (
              <Link
                href="/works/new"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#1b59f8] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Share New Work</span>
              </Link>
            )}

            {isMounted && isLoggedIn && (
              <Link
                href="/profile/edit"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <UserCog className="w-3.5 h-3.5 text-[#1b59f8]" />
                <span>Edit Profile</span>
              </Link>
            )}

            {isMounted && !isLoggedIn && (
              <div className="pt-1 flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Signup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {isMounted && isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
