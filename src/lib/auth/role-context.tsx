'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRoleType = 'admin' | 'student' | 'recruiter';

export interface RoleUser {
  id: string;
  name: string;
  role: UserRoleType;
  roleLabel: string;
  email: string;
  title: string;
  badge: string;
  avatar: string;
  initials: string;
  dashboardUrl: string;
  accentColor: string;
  institution?: string;
  company?: string;
}

export const ROLE_PERSONAS: Record<UserRoleType, RoleUser> = {
  admin: {
    id: 'user-admin',
    name: 'Alex Rivera (Me)',
    role: 'admin',
    roleLabel: 'Admin (Me)',
    email: 'admin@campus-skill-connect.dev',
    title: 'Lead Platform Architect & Superadmin',
    badge: 'SUPERADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    initials: 'AD',
    dashboardUrl: '/admin',
    accentColor: 'rose',
    institution: 'Campus Skill Connect Core Team',
  },
  student: {
    id: 'user-1',
    name: 'Alex Rivera',
    role: 'student',
    roleLabel: 'Student Builder',
    email: 'alex.rivera@iisc.ac.in',
    title: 'Final-Year MCA • Distributed Systems & AI',
    badge: 'VERIFIED BUILDER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    initials: 'AR',
    dashboardUrl: '/dashboard/student',
    accentColor: 'violet',
    institution: 'Indian Institute of Science (IISc)',
  },
  recruiter: {
    id: 'user-5',
    name: 'Marcus Chen',
    role: 'recruiter',
    roleLabel: 'Tech Recruiter',
    email: 'marcus.chen@stripe.com',
    title: 'Senior University Talent Partner @ Stripe',
    badge: 'VERIFIED RECRUITER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    initials: 'MC',
    dashboardUrl: '/dashboard/recruiter',
    accentColor: 'emerald',
    company: 'Stripe & Scale AI',
  },
};

interface RoleContextValue {
  isLoggedIn: boolean;
  isMounted: boolean;
  currentRole: UserRoleType | null;
  currentUser: RoleUser | null;
  login: (role: UserRoleType, redirectUrl?: string) => void;
  switchRole: (role: UserRoleType, redirect?: boolean) => void;
  signOut: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRoleType | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const loggedIn = localStorage.getItem('csc_is_logged_in') === 'true';
      const storedRole = localStorage.getItem('csc_active_role') as UserRoleType;
      if (loggedIn && storedRole && ROLE_PERSONAS[storedRole]) {
        setIsLoggedIn(true);
        setCurrentRole(storedRole);
      } else {
        setIsLoggedIn(false);
        setCurrentRole(null);
      }
    } catch {
      // LocalStorage unavailable
      setIsLoggedIn(false);
      setCurrentRole(null);
    }
  }, []);

  const login = (role: UserRoleType, redirectUrl?: string) => {
    setIsLoggedIn(true);
    setCurrentRole(role);
    try {
      localStorage.setItem('csc_is_logged_in', 'true');
      localStorage.setItem('csc_active_role', role);
      document.cookie = 'csc_is_logged_in=true; path=/; max-age=2592000; SameSite=Lax';
      document.cookie = `csc_active_role=${role}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {
      // ignore
    }
    const target = redirectUrl ? decodeURIComponent(redirectUrl) : ROLE_PERSONAS[role].dashboardUrl;
    window.location.href = target;
  };

  const switchRole = (role: UserRoleType, redirect: boolean = false) => {
    setIsLoggedIn(true);
    setCurrentRole(role);
    try {
      localStorage.setItem('csc_is_logged_in', 'true');
      localStorage.setItem('csc_active_role', role);
      document.cookie = 'csc_is_logged_in=true; path=/; max-age=2592000; SameSite=Lax';
      document.cookie = `csc_active_role=${role}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {
      // ignore
    }
    if (redirect) {
      window.location.href = ROLE_PERSONAS[role].dashboardUrl;
    }
  };

  const signOut = () => {
    setIsLoggedIn(false);
    setCurrentRole(null);
    try {
      localStorage.removeItem('csc_is_logged_in');
      localStorage.removeItem('csc_active_role');
      document.cookie = 'csc_is_logged_in=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'csc_active_role=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // ignore
    }
    window.location.href = '/dashboard';
  };

  const currentUser = currentRole ? ROLE_PERSONAS[currentRole] : null;

  return (
    <RoleContext.Provider
      value={{
        isLoggedIn,
        isMounted,
        currentRole,
        currentUser,
        login,
        switchRole,
        signOut,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    return {
      isLoggedIn: false,
      isMounted: false,
      currentRole: null,
      currentUser: null,
      login: () => {},
      switchRole: () => {},
      signOut: () => {},
    };
  }
  return context;
}
