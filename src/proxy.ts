import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check for active platform session cookies or Supabase auth token
  const cscSession = request.cookies.get('csc_session')?.value;
  const cscRole = request.cookies.get('csc_role')?.value as 'admin' | 'student' | 'recruiter' | undefined;
  const hasSupabaseAuth = request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  const isAuthenticated = cscSession === 'active' || Boolean(cscRole) || hasSupabaseAuth;

  // Determine target dashboard based on stored role or default to student
  const role = cscRole || 'student';
  const targetDashboard =
    role === 'admin'
      ? '/admin'
      : role === 'recruiter'
      ? '/dashboard/recruiter'
      : '/dashboard/student';

  // 1. If authenticated user visits root /dashboard -> immediately route to their active workspace
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
  }

  // 2. If authenticated user visits /sign-in or /sign-up -> immediately route them to their destination or dashboard
  if (
    pathname === '/sign-in' ||
    pathname === '/sign-in/' ||
    pathname === '/sign-up' ||
    pathname === '/sign-up/'
  ) {
    if (isAuthenticated) {
      const redirectParam = searchParams.get('redirect');
      const destination = redirectParam ? decodeURIComponent(redirectParam) : targetDashboard;
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }
  // 3. Sharing work requires an authenticated session — unauthenticated users must sign in first
  if (pathname.startsWith('/works/new')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in?redirect=%2Fworks%2Fnew', request.url));
    }
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 4. Recruiter directory and search require an authenticated session
  if (pathname.startsWith('/recruiter')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL('/sign-in?redirect=' + encodeURIComponent(pathname), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/',
    '/sign-in',
    '/sign-in/',
    '/sign-up',
    '/sign-up/',
    '/works/new',
    '/works/new/:path*',
    '/recruiter',
    '/recruiter/:path*',
  ],
};
