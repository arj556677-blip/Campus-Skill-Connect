'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { createClient } from '@/lib/supabase/client';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/config';

export type UserRoleType = 'admin' | 'student' | 'faculty' | 'recruiter';

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
  faculty: {
    id: 'user-faculty',
    name: 'Dr. Anita Sengupta',
    role: 'faculty',
    roleLabel: 'Faculty Mentor',
    email: 'faculty@campus.edu',
    title: 'Associate Professor & Systems Security Mentor',
    badge: 'FACULTY MENTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    initials: 'AS',
    dashboardUrl: '/dashboard/student',
    accentColor: 'indigo',
    institution: 'School of Computing & Engineering',
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

function setSessionCookies(role: UserRoleType, profile?: Partial<RoleUser>) {
  if (typeof document === 'undefined') return;
  const maxAge = 604800; // 7 days
  document.cookie = `csc_session=active; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `csc_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (profile?.name) {
    document.cookie = `csc_user_name=${encodeURIComponent(profile.name)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  if (profile?.email) {
    document.cookie = `csc_user_email=${encodeURIComponent(profile.email)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  if (profile?.avatar) {
    document.cookie = `csc_user_avatar=${encodeURIComponent(profile.avatar)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

function clearSessionCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'csc_session=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'csc_role=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'csc_user_name=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'csc_user_email=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'csc_user_avatar=; path=/; max-age=0; SameSite=Lax';
}

interface RoleContextValue {
  isLoggedIn: boolean;
  isMounted: boolean;
  currentRole: UserRoleType | null;
  currentUser: RoleUser | null;
  login: (role: UserRoleType, redirectUrl?: string, customProfile?: Partial<RoleUser>) => void;
  switchRole: (role: UserRoleType, redirect?: boolean) => void;
  updateUserProfile: (updates: Partial<RoleUser>) => void;
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

    // 1. Synchronous hydration from localStorage for instant, zero-flicker UI
    if (typeof window !== 'undefined') {
      try {
        const storedSession = localStorage.getItem('csc_session');
        const storedRole = localStorage.getItem('csc_role') as UserRoleType | null;
        const storedProfileRaw = localStorage.getItem('csc_user_profile');

        if (storedSession === 'active' && storedRole && ROLE_PERSONAS[storedRole]) {
          setIsLoggedIn(true);
          setCurrentRole(storedRole);
          if (storedProfileRaw) {
            try {
              const parsed = JSON.parse(storedProfileRaw);
              const validName = parsed?.name?.trim() || ROLE_PERSONAS[storedRole].name;
              parsed.name = validName;
              parsed.initials = parsed.initials || validName.slice(0, 2).toUpperCase();
              setUserProfile(parsed);
            } catch {
              setUserProfile(ROLE_PERSONAS[storedRole]);
            }
          } else {
            setUserProfile(ROLE_PERSONAS[storedRole]);
          }
        }
      } catch {
        // fallback
      }
    }

    // 2. Supabase Auth Check
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
            role === 'admin'
              ? 'Admin'
              : role === 'recruiter'
                ? 'Tech Recruiter'
                : role === 'faculty'
                  ? 'Faculty Mentor'
                  : 'Student Builder';
          const dashboardUrl =
            role === 'admin'
              ? '/admin'
              : role === 'recruiter'
                ? '/dashboard/recruiter'
                : '/dashboard/student';

          const resolvedName = profile?.display_name?.trim() || user.email?.split('@')[0] || 'User';
          const resolvedProfile: RoleUser = {
            id: user.id,
            name: resolvedName,
            role,
            roleLabel,
            email: user.email || '',
            title: profile?.headline || 'Campus Skill Connect Member',
            badge: role === 'faculty' ? 'FACULTY MENTOR' : role.toUpperCase(),
            avatar:
              profile?.avatar_path ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            initials: resolvedName.slice(0, 2).toUpperCase(),
            dashboardUrl,
            accentColor: role === 'admin' ? 'rose' : role === 'recruiter' ? 'emerald' : role === 'faculty' ? 'indigo' : 'violet',
          };

          setUserProfile(resolvedProfile);
          setSessionCookies(role, resolvedProfile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('csc_session', 'active');
            localStorage.setItem('csc_role', role);
            localStorage.setItem('csc_user_profile', JSON.stringify(resolvedProfile));
          }
        }
      } catch (err) {
        console.warn('[RoleProvider] Auth check failed:', err);
      }
    }

    loadUserSession();

    // 3. Firebase Auth State Listener
    let unsubscribeFirebase: (() => void) | undefined;
    try {
      unsubscribeFirebase = onAuthStateChanged(firebaseAuth, (fbUser) => {
        if (!active) return;
        if (fbUser) {
          setIsLoggedIn(true);
          const savedRole =
            (typeof window !== 'undefined' && (localStorage.getItem('csc_role') as UserRoleType)) ||
            'student';
          setCurrentRole(savedRole);
          const basePersona = ROLE_PERSONAS[savedRole];
          const resolvedName =
            fbUser.displayName?.trim() || fbUser.email?.split('@')[0] || basePersona.name || 'Builder';
          const fbProfile: RoleUser = {
            ...basePersona,
            id: fbUser.uid,
            name: resolvedName,
            email: fbUser.email || basePersona.email,
            avatar: fbUser.photoURL || basePersona.avatar,
            initials: resolvedName.slice(0, 2).toUpperCase(),
          };
          setUserProfile(fbProfile);
          setSessionCookies(savedRole, fbProfile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('csc_session', 'active');
            localStorage.setItem('csc_role', savedRole);
            localStorage.setItem('csc_user_profile', JSON.stringify(fbProfile));
          }
        }
      });
    } catch (e) {
      console.warn('[RoleProvider] Firebase auth listener notice:', e);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        const hasActiveCscSession =
          typeof window !== 'undefined' && localStorage.getItem('csc_session') === 'active';
        if (!hasActiveCscSession && !firebaseAuth?.currentUser) {
          setIsLoggedIn(false);
          setCurrentRole(null);
          setUserProfile(null);
        }
      } else {
        loadUserSession();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  const login = (role: UserRoleType, redirectUrl?: string, customProfile?: Partial<RoleUser>) => {
    setCurrentRole(role);
    setIsLoggedIn(true);

    const basePersona = ROLE_PERSONAS[role];
    const resolvedName =
      customProfile?.name?.trim() || customProfile?.email?.split('@')[0] || basePersona.name || 'Builder';
    const resolvedEmail = customProfile?.email?.trim() || basePersona.email;
    const resolvedAvatar = customProfile?.avatar || basePersona.avatar;
    const resolvedInitials = resolvedName.slice(0, 2).toUpperCase();

    const profileToStore: RoleUser = {
      ...basePersona,
      id: customProfile?.id || basePersona.id,
      name: resolvedName,
      email: resolvedEmail,
      avatar: resolvedAvatar,
      initials: resolvedInitials,
      role,
      roleLabel:
        role === 'admin'
          ? 'Admin'
          : role === 'recruiter'
            ? 'Tech Recruiter'
            : role === 'faculty'
              ? 'Faculty Mentor'
              : 'Student Builder',
      dashboardUrl: basePersona.dashboardUrl,
    };

    setUserProfile(profileToStore);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('csc_session', 'active');
        localStorage.setItem('csc_role', role);
        localStorage.setItem('csc_user_profile', JSON.stringify(profileToStore));
        setSessionCookies(role, profileToStore);
      } catch (e) {
        console.warn('[RoleProvider] Error saving session to storage:', e);
      }
    }

    const target = redirectUrl ? decodeURIComponent(redirectUrl) : ROLE_PERSONAS[role].dashboardUrl;
    window.location.replace(target);
  };

  const switchRole = (role: UserRoleType, redirect: boolean = false) => {
    setCurrentRole(role);
    const newProfile = ROLE_PERSONAS[role];
    setUserProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('csc_session', 'active');
      localStorage.setItem('csc_role', role);
      localStorage.setItem('csc_user_profile', JSON.stringify(newProfile));
      setSessionCookies(role, newProfile);
    }
    if (redirect) {
      window.location.replace(ROLE_PERSONAS[role].dashboardUrl);
    }
  };

  const updateUserProfile = (updates: Partial<RoleUser>) => {
    setUserProfile((prev) => {
      const activeRole = currentRole || 'student';
      const base = prev || ROLE_PERSONAS[activeRole];
      const updated: RoleUser = {
        ...base,
        ...updates,
      };
      if (updates.name) {
        const trimmed = updates.name.trim();
        updated.name = trimmed;
        updated.initials = trimmed.slice(0, 2).toUpperCase();
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('csc_user_profile', JSON.stringify(updated));
          setSessionCookies(updated.role, updated);
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    try {
      await firebaseSignOut(firebaseAuth);
    } catch {
      // ignore
    }
    clearSessionCookies();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('csc_session');
      localStorage.removeItem('csc_role');
      localStorage.removeItem('csc_user_profile');
    }
    setIsLoggedIn(false);
    setCurrentRole(null);
    setUserProfile(null);
    window.location.assign('/sign-in');
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
        updateUserProfile,
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
      updateUserProfile: () => {},
      signOut: async () => {},
    };
  }
  return context;
}
