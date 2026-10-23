import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let redisStatus = 'offline';
  let redisPingMs = 0;
  let supabaseStatus = 'offline';
  let supabaseLatencyMs = 0;

  // 1. Check Redis / Limiter status
  try {
    const redis = getRedisClient();
    const pingStart = Date.now();
    await redis.ping();
    redisPingMs = Date.now() - pingStart;
    redisStatus = 'connected';
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'connection failed';
    redisStatus = `offline: ${message}`;
  }

  // 2. Check Supabase reachability separately
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supaStart = Date.now();
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      supabaseLatencyMs = Date.now() - supaStart;
      if (error) {
        supabaseStatus = `error: ${error.message}`;
      } else {
        supabaseStatus = 'connected';
      }
    } else {
      supabaseStatus = 'unconfigured';
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'connection failed';
    supabaseStatus = `offline: ${message}`;
  }

  const isHealthy = redisStatus === 'connected' || supabaseStatus === 'connected';

  const payload = {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      nextjs: { status: 'healthy', latencyMs: Date.now() - startTime },
      redisRateLimiter: { status: redisStatus, latencyMs: redisPingMs },
      supabaseDatabase: { status: supabaseStatus, latencyMs: supabaseLatencyMs },
    },
  };

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
