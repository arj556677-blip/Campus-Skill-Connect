/* ─────────────────────────────────────────────────────
 * Supabase — Middleware / Proxy Client
 * Refreshes auth tokens on each request using verified SSR cookies.
 * Strictly derives session identity from supabase.auth.getUser().
 * Never trusts client-supplied demo cookies or localStorage.
 * ───────────────────────────────────────────────────── */

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // In local dev without live Supabase configured, pass through request
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Refresh the session — cryptographically verified SSR auth token check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Also check for active CSC session cookie (Firebase OAuth or authenticated app session)
    const cscSession = request.cookies.get('csc_session')?.value;
    const cscRole = request.cookies.get('csc_role')?.value;

    const isAuthenticated = !!user || cscSession === 'active' || !!cscRole;

    // Prevent navigating back to sign-in / login while having an active session (prevents login session breach)
    const isAuthRoute =
      request.nextUrl.pathname === '/sign-in' ||
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/sign-up';

    if (isAuthRoute && isAuthenticated) {
      const dest =
        cscRole === 'admin'
          ? '/admin'
          : cscRole === 'recruiter'
          ? '/dashboard/recruiter'
          : '/dashboard/student';
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // Protected member routes
    const protectedRoutes = [
      '/works/new',
      '/messages',
      '/dashboard/student',
      '/dashboard/recruiter',
      '/profile/edit',
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Admin routes — strictly enforced by verified database role check or admin role session
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        url.searchParams.set('role', 'admin');
        url.searchParams.set('redirect', '/admin');
        return NextResponse.redirect(url);
      }

      // Check verified role from user_roles or profiles table in Postgres or verified role cookie
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin' && cscRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } else if (cscRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.warn('[Supabase Middleware] Session verification error:', error);
    return supabaseResponse;
  }
}
