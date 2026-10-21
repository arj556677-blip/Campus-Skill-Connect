/* ─────────────────────────────────────────────────────
 * Supabase — Server (Server Component / Route Handler) Client
 * Cookie-based SSR authentication pattern
 * ───────────────────────────────────────────────────── */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

/** Get the current authenticated user or null */
export async function getUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
}

/** Get the current user's profile or null */
export async function getUserProfile() {
  try {
    const user = await getUser();
    if (!user) return null;

    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('profiles')
      .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
      .eq('id', user.id)
      .single();

    return data;
  } catch (err) {
    return null;
  }
}

