/* ─────────────────────────────────────────────────────
 * Redis — Cache-Aside Layer for Supabase Optimization
 * Transparent caching with TTL-based invalidation
 * Graceful fallback when Redis is offline
 * ───────────────────────────────────────────────────── */

import { getRedisClient } from './client';

const PREFIX = 'cache:';

/** Default TTLs in seconds */
export const CacheTTL = {
  PROFILE: 300,        // 5 minutes
  WORK: 300,           // 5 minutes
  DISCOVER_FEED: 120,  // 2 minutes
  SKILLS_ALL: 1800,    // 30 minutes
  SKILLS_TRENDING: 600, // 10 minutes
  COMMUNITIES: 3600,   // 1 hour
  ZONES: 3600,         // 1 hour
} as const;

/**
 * Get a cached value or execute the fetcher and cache the result.
 * Cache-aside pattern: check Redis first, fallback to DB query, then store in Redis.
 */
export async function cacheGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const redis = getRedisClient();
  const cacheKey = PREFIX + key;

  // 1. Try cache if Redis connection is active
  if (redis.status === 'ready') {
    try {
      const cached = await redis.get(cacheKey);
      if (cached && cached !== 'null') {
        const parsed = JSON.parse(cached);
        if (parsed !== null && parsed !== undefined) {
          return parsed as T;
        }
      }
    } catch {
      // Redis read failed, fall through smoothly to source
    }
  }

  // 2. Fetch from source (Supabase / local data store)
  const data = await fetcher();

  // 3. Store in cache if Redis is active
  if (redis.status === 'ready' && data !== null && data !== undefined) {
    try {
      await redis.setex(cacheKey, ttlSeconds, JSON.stringify(data));
    } catch {
      // Non-blocking write failure
    }
  }

  return data;
}

/** Invalidate a specific cache key */
export async function cacheInvalidate(key: string): Promise<void> {
  const redis = getRedisClient();
  if (redis.status === 'ready') {
    try {
      await redis.del(PREFIX + key);
    } catch {
      // Non-blocking
    }
  }
}

/** Invalidate all keys matching a pattern */
export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const redis = getRedisClient();
  if (redis.status === 'ready') {
    try {
      const keys = await redis.keys(PREFIX + pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Non-blocking
    }
  }
}

/** Manually set a cache value */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
  const redis = getRedisClient();
  if (redis.status === 'ready') {
    try {
      await redis.setex(PREFIX + key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Non-blocking
    }
  }
}

// ── Specific cache key generators ──

export const CacheKeys = {
  profile: (userId: string) => `profile:${userId}`,
  work: (workId: string) => `work:${workId}`,
  userWorks: (userId: string) => `user_works:${userId}`,
  discoverFeed: (hash: string) => `feed:discover:v5:${hash}`,
  showcaseFeed: (hash: string) => `feed:showcase:v5:${hash}`,
  skillsAll: () => 'skills:all',
  skillsTrending: () => 'skills:trending',
  userSkills: (userId: string) => `user_skills:${userId}`,
  communities: () => 'communities:all',
  zones: () => 'zones:all',
  connections: (userId: string) => `connections:${userId}`,
  conversations: (userId: string) => `conversations:${userId}`,
  notifications: (userId: string) => `notifications:${userId}`,
};
