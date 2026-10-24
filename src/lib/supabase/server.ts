/* ─────────────────────────────────────────────────────
 * Supabase — Server (Server Component / Route Handler) Client
 * Cookie-based SSR authentication pattern
 * ───────────────────────────────────────────────────── */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Component — ignore
            // This is expected when called from a Server Component
          }
        },
      },
    }
  );
}

/**
 * Service-role admin client that bypasses RLS for system feeds and server data loaders.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder_anon_key';

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Get the current authenticated user or fallback session identity or null */
export async function getUser(): Promise<User | null> {
  // 1. Check live Supabase Auth session token
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return user;
  } catch {
    // Continue to platform session cookie fallback
  }

  // 2. Check for active CSC session cookies (OTP verification, Firebase, or demo persona session)
  try {
    const cookieStore = await cookies();
    const cscSession = cookieStore.get('csc_session')?.value;
    const cscRole = cookieStore.get('csc_role')?.value as 'admin' | 'student' | 'faculty' | 'recruiter' | undefined;
    const rawEmail = cookieStore.get('csc_user_email')?.value;
    const rawName = cookieStore.get('csc_user_name')?.value;
    const rawAvatar = cookieStore.get('csc_user_avatar')?.value;

    if (cscSession === 'active' || cscRole) {
      const role = cscRole || 'student';
      const email = rawEmail
        ? decodeURIComponent(rawEmail)
        : role === 'student'
        ? 'student@campus.edu'
        : role === 'faculty'
        ? 'faculty@campus.edu'
        : role === 'admin'
        ? 'admin@campus-skill-connect.dev'
        : 'recruiter@company.com';
      const name = rawName
        ? decodeURIComponent(rawName)
        : role === 'student'
        ? 'Student Builder'
        : role === 'faculty'
        ? 'Faculty Advisor'
        : role === 'admin'
        ? 'Administrator'
        : 'Talent Partner';
      const avatar = rawAvatar ? decodeURIComponent(rawAvatar) : '';
      const id = email.includes('ragav')
        ? 'c0000000-0000-0000-0000-000000000001'
        : role === 'recruiter'
        ? 'c0000000-0000-0000-0000-000000000002'
        : role === 'admin'
        ? 'c0000000-0000-0000-0000-000000000003'
        : 'c0000000-0000-0000-0000-000000000001';

      const syntheticUser: User = {
        id,
        app_metadata: { provider: 'email', role },
        user_metadata: {
          display_name: name,
          full_name: name,
          name,
          role,
          avatar_url: avatar,
        },
        aud: 'authenticated',
        confirmation_sent_at: new Date().toISOString(),
        recovery_sent_at: '',
        email_change_sent_at: '',
        new_email: '',
        invited_at: '',
        action_link: '',
        email,
        phone: '',
        created_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: '',
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        identities: [],
        factors: [],
      };

      return syntheticUser;
    }
  } catch {
    // Fallback fails
  }

  return null;
}

/** Get the current user's profile or null */
export async function getUserProfile() {
  try {
    const user = await getUser();
    if (!user) return null;

    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from('profiles')
        .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
        .eq('id', user.id)
        .single();

      if (data) return data;
    } catch {
      // ignore db error
    }

    // Synthesize profile if database is in mock or unseeded state
    return {
      id: user.id,
      email: user.email || 'student@campus.edu',
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || 'Student Builder',
      role: user.user_metadata?.role || 'student',
      avatar_url: user.user_metadata?.avatar_url || null,
      headline: 'Student Builder • Portfolio & Proof of Work',
      institution_id: null,
      campus_id: null,
      zone_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (err) {
    return null;
  }
}

