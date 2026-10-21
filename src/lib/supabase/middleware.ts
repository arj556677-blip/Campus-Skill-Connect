/* ─────────────────────────────────────────────────────
 * Supabase — Middleware Client
 * Refreshes auth tokens on each request
 * ───────────────────────────────────────────────────── */

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // In local dev without live Supabase configured, pass through request smoothly
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

    // Refresh the session — this is critical for SSR auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check for client-side demo role authentication cookies
    const isDemoLoggedIn = request.cookies.get('csc_is_logged_in')?.value === 'true';
    const demoRole = request.cookies.get('csc_active_role')?.value;
    const isAuthenticated = !!user || isDemoLoggedIn;

    // Protected routes — only genuinely private operations require authentication
    const protectedRoutes = [
      '/profile/edit',
      '/works/new',
      '/messages',
      '/settings',
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

    // Admin routes — verify admin role (either from Supabase profile or active role session)
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        url.searchParams.set('role', 'admin');
        url.searchParams.set('redirect', '/admin');
        return NextResponse.redirect(url);
      }

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin' && demoRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } else if (demoRole !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        url.searchParams.set('role', 'admin');
        url.searchParams.set('redirect', '/admin');
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.warn('[Supabase Middleware] Session check failed:', error);
    return supabaseResponse;
  }
}
