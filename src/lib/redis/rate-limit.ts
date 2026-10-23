/* ─────────────────────────────────────────────────────
 * Redis — Sliding Window Rate Limiter
 * Protects API routes from abuse
 * ───────────────────────────────────────────────────── */

import { getRedisClient } from './client';

const PREFIX = 'ratelimit:';

interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/** Pre-defined rate limit configurations */
export const RateLimits = {
  SEARCH: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,
  AI_ENDPOINT: { maxRequests: 10, windowSeconds: 60 } as RateLimitConfig,
  CONNECTION: { maxRequests: 15, windowSeconds: 60 } as RateLimitConfig,
  CHAT: { maxRequests: 120, windowSeconds: 60 } as RateLimitConfig,
  AUTH: { maxRequests: 5, windowSeconds: 300 } as RateLimitConfig,
  UPLOAD: { maxRequests: 10, windowSeconds: 60 } as RateLimitConfig,
  REPORT: { maxRequests: 10, windowSeconds: 60 } as RateLimitConfig,
  GENERAL: { maxRequests: 100, windowSeconds: 60 } as RateLimitConfig,
} as const;

/**
 * Check and consume a rate limit token using a sliding window.
 * Uses Redis sorted sets for precise sliding window counting.
 *
 * @param identifier - Unique key (IP address or user ID)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed and remaining quota
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  options?: { failClosed?: boolean }
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const key = `${PREFIX}${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  try {
    // Use a Redis pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Remove expired entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current entries in the window
    pipeline.zcard(key);

    // Add the current request
    pipeline.zadd(key, now, `${now}:${Math.random()}`);

    // Set key expiry to auto-cleanup
    pipeline.expire(key, config.windowSeconds);

    const results = await pipeline.exec();

    // results[1] is the zcard result: [error, count]
    const currentCount = (results?.[1]?.[1] as number) ?? 0;

    if (currentCount >= config.maxRequests) {
      // Get the oldest entry to calculate reset time
      const oldest = await redis.zrange(key, '0', '0', 'WITHSCORES');
      const oldestTimestamp = oldest.length >= 2 ? parseInt(oldest[1]) : now;
      const resetIn = Math.ceil(
        (oldestTimestamp + config.windowSeconds * 1000 - now) / 1000
      );

      return {
        allowed: false,
        remaining: 0,
        resetInSeconds: Math.max(resetIn, 1),
      };
    }

    return {
      allowed: true,
      remaining: Math.max(config.maxRequests - currentCount - 1, 0),
      resetInSeconds: config.windowSeconds,
    };
  } catch (err) {
    console.warn('[RateLimit] Storage unavailable:', err);
    // Per specification: Fail closed for sensitive (auth, AI) endpoints, fail open for read routes
    if (options?.failClosed) {
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds: config.windowSeconds,
      };
    }

    return {
      allowed: true,
      remaining: config.maxRequests,
      resetInSeconds: config.windowSeconds,
    };
  }
}

/** Get rate limit headers for API responses */
export function getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig) {
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetInSeconds.toString(),
  };
}
