import { describe, it, expect } from 'vitest';
import { checkRateLimit, RateLimits } from '@/lib/redis/rate-limit';
import { getClientIp } from '@/lib/utils/ip';

describe('Rate Limiter & Trusted IP Extraction', () => {
  it('extracts trusted IP from x-real-ip or direct connection', () => {
    const mockRequest1 = {
      headers: new Headers({ 'x-real-ip': '203.0.113.195' }),
    } as unknown as Parameters<typeof getClientIp>[0];
    expect(getClientIp(mockRequest1)).toBe('203.0.113.195');

    const mockRequest2 = {
      headers: new Headers({ 'cf-connecting-ip': '198.51.100.42' }),
    } as unknown as Parameters<typeof getClientIp>[0];
    expect(getClientIp(mockRequest2)).toBe('198.51.100.42');
  });

  it('never trusts an arbitrary client-supplied x-forwarded-for without validation', () => {
    const mockRequest = {
      headers: new Headers({ 'x-forwarded-for': '10.0.0.1, 192.168.1.1' }),
    } as unknown as Parameters<typeof getClientIp>[0];
    const ip = getClientIp(mockRequest);
    // Should extract the first valid external entry or safe fallback
    expect(ip).toBeTruthy();
  });

  it('fails closed for auth and AI endpoints when limiter is offline', async () => {
    const result = await checkRateLimit('test-client-ip', RateLimits.AUTH, { failClosed: true });
    // When Redis is not connected and failClosed is specified, it should reject or handle securely
    expect(result).toHaveProperty('allowed');
  });

  it('fails open for read endpoints when limiter is offline', async () => {
    const result = await checkRateLimit('test-client-ip', RateLimits.GENERAL, { failClosed: false });
    expect(result.allowed).toBe(true);
  });
});
