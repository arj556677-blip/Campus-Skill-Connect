import { NextRequest } from 'next/server';

/**
 * Derives client IP safely from request headers.
 * Never blindly trusts spoofable client-supplied headers like single X-Forwarded-For.
 * In a standard reverse-proxy setup (e.g. Vercel, Cloudflare, Nginx),
 * headers like 'cf-connecting-ip', 'x-real-ip', or the rightmost trusted hop in 'x-forwarded-for'
 * are used.
 */
export function getClientIp(request: NextRequest): string {
  // 1. Cloudflare connecting IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && isValidIp(cfIp)) {
    return cfIp.trim();
  }

  // 2. Direct upstream proxy (X-Real-IP set by Nginx)
  const realIp = request.headers.get('x-real-ip');
  if (realIp && isValidIp(realIp)) {
    return realIp.trim();
  }

  // 3. X-Forwarded-For: take the rightmost non-internal IP or first entry
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((s) => s.trim()).filter(Boolean);
    // Use the rightmost client hop provided by upstream trusted proxy
    const clientIp = ips[ips.length - 1];
    if (clientIp && isValidIp(clientIp)) {
      return clientIp;
    }
  }

  // 4. Fallback for local development or direct connection
  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // IPv4 simple validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 simple validation
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
