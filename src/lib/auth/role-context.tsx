'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { createClient } from '@/lib/supabase/client';

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
    name: 'Administrator',
    role: 'admin',
    roleLabel: 'Admin',
    email: 'admin@campus-skill-connect.dev',
    title: 'Platform Administrator',
    badge: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    initials: 'AD',
    dashboardUrl: '/admin',
    accentColor: 'rose',
    institution: 'Campus Skill Connect Team',
  },
  student: {
    id: 'user-student',
    name: 'Student Builder',
    role: 'student',
    roleLabel: 'Student Builder',
    email: 'student@campus.edu',
    title: 'Student Builder • Portfolio & Proof of Work',
    badge: 'VERIFIED BUILDER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    initials: 'SB',
    dashboardUrl: '/dashboard/student',
    accentColor: 'violet',
    institution: 'Engineering & Computing',
  },
  recruiter: {
    id: 'user-recruiter',
    name: 'Talent Partner',
    role: 'recruiter',
    roleLabel: 'Tech Recruiter',
    email: 'recruiter@company.com',
    title: 'University Talent Partner',
    badge: 'VERIFIED RECRUITER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    initials: 'TP',
    dashboardUrl: '/dashboard/recruiter',
    accentColor: 'emerald',
    company: 'Partner Enterprise',
  },
};

interface RoleContextValue {
  isLoggedIn: boolean;
  isMounted: boolean;
  currentRole: UserRoleType | null;
  currentUser: RoleUser | null;
  login: (role: UserRoleType, redirectUrl?: string) => void;
  switchRole: (role: UserRoleType, redirect?: boolean) => void;
  signOut: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

// Safe subscription for mount state without synchronous setState inside useEffect
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRoleType | null>(null);
  const [userProfile, setUserProfile] = useState<RoleUser | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadUserSession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (user) {
          setIsLoggedIn(true);

          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, display_name, headline, avatar_path')
            .eq('id', user.id)
            .single();

          if (!active) return;

          const role = (profile?.role as UserRoleType) || 'student';
          setCurrentRole(role);

          const roleLabel =
            role === 'admin' ? 'Admin' : role === 'recruiter' ? 'Tech Recruiter' : 'Student Builder';
          const dashboardUrl =
            role === 'admin'
              ? '/admin'
              : role === 'recruiter'
                ? '/dashboard/recruiter'
                : '/dashboard/student';

          setUserProfile({
            id: user.id,
            name: profile?.display_name || user.email?.split('@')[0] || 'User',
            role,
            roleLabel,
            email: user.email || '',
            title: profile?.headline || 'Campus Skill Connect Member',
            badge: role.toUpperCase(),
            avatar:
              profile?.avatar_path ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            initials: (profile?.display_name || user.email || 'U').slice(0, 2).toUpperCase(),
            dashboardUrl,
            accentColor: role === 'admin' ? 'rose' : role === 'recruiter' ? 'emerald' : 'violet',
          });
        } else {
          setIsLoggedIn(false);
          setCurrentRole(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.warn('[RoleProvider] Auth check failed:', err);
      }
    }

    loadUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsLoggedIn(false);
        setCurrentRole(null);
        setUserProfile(null);
      } else {
        loadUserSession();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (role: UserRoleType, redirectUrl?: string) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    const target = redirectUrl ? decodeURIComponent(redirectUrl) : ROLE_PERSONAS[role].dashboardUrl;
    window.location.assign(target);
  };

  const switchRole = (role: UserRoleType, redirect: boolean = false) => {
    setCurrentRole(role);
    if (redirect) {
      window.location.assign(ROLE_PERSONAS[role].dashboardUrl);
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    setCurrentRole(null);
    setUserProfile(null);
    window.location.assign('/dashboard');
  };

  const currentUser = userProfile || (currentRole ? ROLE_PERSONAS[currentRole] : null);

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
      signOut: async () => {},
    };
  }
  return context;
}
