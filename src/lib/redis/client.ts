/* ─────────────────────────────────────────────────────
 * Redis — Singleton Client (ioredis)
 * Connection pooling with lazy initialization
 * ───────────────────────────────────────────────────── */

import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy(times) {
        if (times > 2) return null; // Stop retrying after 2 attempts
        return Math.min(times * 200, 1000);
      },
      reconnectOnError(err) {
        const targetErrors = ['READONLY', 'ECONNRESET'];
        return targetErrors.some((e) => err.message.includes(e));
      },
      lazyConnect: true,
      enableOfflineQueue: false,
      enableReadyCheck: false,
      keepAlive: 30000,
    });

    redis.on('error', () => {
      // Silently handle — cache layer falls through to DB/mock
    });
  }

  return redis;
}

/** Graceful shutdown helper */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
