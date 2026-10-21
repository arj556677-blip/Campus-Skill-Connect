import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let redisStatus = 'disconnected';
  let redisPingMs = 0;

  try {
    const redis = getRedisClient();
    const pingStart = Date.now();
    await redis.ping();
    redisPingMs = Date.now() - pingStart;
    redisStatus = 'connected';
  } catch (err: any) {
    redisStatus = 'offline: ' + (err.message || 'connection failed');
  }

  const payload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      nextjs: { status: 'healthy', latencyMs: Date.now() - startTime },
      redis: { status: redisStatus, latencyMs: redisPingMs },
      supabase: {
        configured: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
            !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
        ),
      },
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
