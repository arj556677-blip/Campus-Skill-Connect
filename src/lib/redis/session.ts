/* ─────────────────────────────────────────────────────
 * Redis — Session & Presence Store
 * Fast session lookups and online presence tracking
 * ───────────────────────────────────────────────────── */

import { getRedisClient } from './client';

const SESSION_PREFIX = 'session:';
const PRESENCE_PREFIX = 'presence:';
const PRESENCE_TTL = 60; // 60 seconds — must heartbeat to stay "online"

// ── Session Management ──

interface SessionData {
  userId: string;
  email: string;
  role: string;
  lastActive: string;
  userAgent?: string;
}

/** Store session metadata for fast lookups (reduces Supabase Auth API calls) */
export async function setSession(
  sessionId: string,
  data: SessionData,
  ttlSeconds: number = 3600
): Promise<void> {
  const redis = getRedisClient();
  try {
    await redis.setex(
      SESSION_PREFIX + sessionId,
      ttlSeconds,
      JSON.stringify(data)
    );
  } catch (err) {
    console.warn('[Session] Set error:', err);
  }
}

/** Retrieve session metadata */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const redis = getRedisClient();
  try {
    const data = await redis.get(SESSION_PREFIX + sessionId);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('[Session] Get error:', err);
    return null;
  }
}

/** Remove a session */
export async function removeSession(sessionId: string): Promise<void> {
  const redis = getRedisClient();
  try {
    await redis.del(SESSION_PREFIX + sessionId);
  } catch (err) {
    console.warn('[Session] Remove error:', err);
  }
}

// In-memory fallback presence cache for local development / offline Redis
const localPresenceCache = new Map<string, number>();

// ── Presence Tracking ──

/** Mark a user as online — must be called periodically (heartbeat) */
export async function setPresence(userId: string): Promise<void> {
  localPresenceCache.set(userId, Date.now() + PRESENCE_TTL * 1000);
  const redis = getRedisClient();
  try {
    await redis.setex(
      PRESENCE_PREFIX + userId,
      PRESENCE_TTL,
      JSON.stringify({ online: true, lastSeen: new Date().toISOString() })
    );
  } catch (err) {
    console.warn('[Presence] Set error (fallback to in-memory):', err);
  }
}

/** Check if a user is currently online */
export async function isOnline(userId: string): Promise<boolean> {
  const redis = getRedisClient();
  try {
    const data = await redis.exists(PRESENCE_PREFIX + userId);
    if (data === 1) return true;
  } catch (err) {
    // Redis unavailable or errored, fall back to in-memory cache
  }

  const exp = localPresenceCache.get(userId);
  if (exp && exp > Date.now()) {
    return true;
  }
  return false;
}

/** Check online status for multiple users at once */
export async function getPresenceBulk(
  userIds: string[]
): Promise<Record<string, boolean>> {
  const redis = getRedisClient();
  const result: Record<string, boolean> = {};

  try {
    const pipeline = redis.pipeline();
    userIds.forEach((id) => pipeline.exists(PRESENCE_PREFIX + id));
    const results = await pipeline.exec();

    userIds.forEach((id, index) => {
      const fromRedis = (results?.[index]?.[1] as number) === 1;
      const exp = localPresenceCache.get(id);
      const fromMemory = !!exp && exp > Date.now();
      result[id] = fromRedis || fromMemory;
    });
  } catch (err) {
    userIds.forEach((id) => {
      const exp = localPresenceCache.get(id);
      result[id] = !!exp && exp > Date.now();
    });
  }

  return result;
}

/** Remove presence (sign out) */
export async function removePresence(userId: string): Promise<void> {
  localPresenceCache.delete(userId);
  const redis = getRedisClient();
  try {
    await redis.del(PRESENCE_PREFIX + userId);
  } catch (err) {
    console.warn('[Presence] Remove error:', err);
  }
}

