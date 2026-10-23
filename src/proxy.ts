/* ─────────────────────────────────────────────────────
 * Next.js 16 Proxy (replaces middleware.ts)
 * Session refresh + route protection
 * ───────────────────────────────────────────────────── */

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // Skip static assets and image optimization routes
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/health') ||
    /\.(?:svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return; // pass through — no processing needed
  }

  return await updateSession(request);
}
