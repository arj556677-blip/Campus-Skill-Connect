'use client';

export type ConnectionStatus = 'none' | 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked';

export interface StoredConnectionItem {
  targetUserId: string;
  name: string;
  headline?: string;
  avatar?: string;
  role?: string;
  institution?: string;
  status: ConnectionStatus;
  isIncoming: boolean; // false = request sent by current user, true = request received
  updatedAt: string;
}

const CONNECTIONS_INDEX_KEY = 'csc_all_connections';
const EVENT_NAME = 'csc-connections-updated';

// Canonical ID aliases (e.g. mock profile id 'user-5' is Marcus Chen)
const ID_ALIASES: Record<string, string[]> = {
  'user-5': ['marcus-chen-recruiter'],
  'marcus-chen-recruiter': ['user-5'],
};

export function getRelatedIds(id: string): string[] {
  const aliases = ID_ALIASES[id] || [];
  return Array.from(new Set([id, ...aliases]));
}

// Known initial demo connections for realistic campus simulation
const DEFAULT_INITIAL_CONNECTIONS: StoredConnectionItem[] = [
  {
    targetUserId: 'user-5',
    name: 'Marcus Chen',
    headline: 'Senior University Talent Partner @ Stripe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
    status: 'accepted',
    isIncoming: false,
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    targetUserId: 'marcus-chen-recruiter',
    name: 'Marcus Chen',
    headline: 'Senior University Talent Partner @ Stripe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
    status: 'accepted',
    isIncoming: false,
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    targetUserId: 'sarah-jenkins-recruiter',
    name: 'Sarah Jenkins',
    headline: 'Senior Technical Recruiter @ TechCorp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'recruiter',
    institution: 'Bangalore Silicon Valley',
    status: 'pending',
    isIncoming: true,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

function getStorageKey(targetUserId: string): string {
  return `csc_conn_${targetUserId}`;
}

export function notifyUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Initializes default connections and synchronizes aliases if not already initialized
 */
function ensureInitialized(): void {
  if (typeof window === 'undefined') return;
  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    if (!rawIndex) {
      const initialIds: string[] = [];
      for (const item of DEFAULT_INITIAL_CONNECTIONS) {
        localStorage.setItem(getStorageKey(item.targetUserId), JSON.stringify(item));
        initialIds.push(item.targetUserId);
      }
      localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(initialIds));
    } else {
      // Synchronize Marcus Chen aliases if one key was previously updated
      const ids: string[] = JSON.parse(rawIndex);
      const mcOld = localStorage.getItem(getStorageKey('marcus-chen-recruiter'));
      const mcNew = localStorage.getItem(getStorageKey('user-5'));

      if (mcOld && !mcNew) {
        const parsed = JSON.parse(mcOld);
        localStorage.setItem(getStorageKey('user-5'), JSON.stringify({ ...parsed, targetUserId: 'user-5' }));
        if (parsed.status !== 'none' && !ids.includes('user-5')) {
          ids.push('user-5');
          localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
        }
      } else if (mcNew && !mcOld) {
        const parsed = JSON.parse(mcNew);
        localStorage.setItem(getStorageKey('marcus-chen-recruiter'), JSON.stringify({ ...parsed, targetUserId: 'marcus-chen-recruiter' }));
        if (parsed.status !== 'none' && !ids.includes('marcus-chen-recruiter')) {
          ids.push('marcus-chen-recruiter');
          localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
        }
      }
    }
  } catch (err) {
    console.warn('[connection-store] Initialization notice:', err);
  }
}

/**
 * Retrieves connection details for a specific user ID (checking aliases transparently)
 */
export function getConnection(targetUserId: string): StoredConnectionItem | null {
  if (typeof window === 'undefined') return null;
  ensureInitialized();

  try {
    const raw = localStorage.getItem(getStorageKey(targetUserId));
    if (raw) {
      return JSON.parse(raw) as StoredConnectionItem;
    }
    // Check aliases
    const aliases = ID_ALIASES[targetUserId] || [];
    for (const alias of aliases) {
      const aliasRaw = localStorage.getItem(getStorageKey(alias));
      if (aliasRaw) {
        return JSON.parse(aliasRaw) as StoredConnectionItem;
      }
    }
  } catch {}
  return null;
}

/**
 * Retrieves all active connections, deduplicating aliases
 */
export function getAllConnections(): StoredConnectionItem[] {
  if (typeof window === 'undefined') return [];
  ensureInitialized();

  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    const ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    const list: StoredConnectionItem[] = [];
    const seenNames = new Set<string>();

    for (const id of ids) {
      const raw = localStorage.getItem(getStorageKey(id));
      if (raw) {
        try {
          const item = JSON.parse(raw) as StoredConnectionItem;
          if (item && item.status !== 'withdrawn' && item.status !== 'none') {
            const normName = (item.name || '').toLowerCase().trim();
            if (normName && seenNames.has(normName)) {
              continue;
            }
            if (normName) seenNames.add(normName);
            list.push(item);
          }
        } catch {}
      }
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Retrieves all outgoing pending requests sent by current user
 */
export function getSentRequests(): StoredConnectionItem[] {
  return getAllConnections().filter((c) => c.status === 'pending' && !c.isIncoming);
}

/**
 * Retrieves all incoming requests received by current user
 */
export function getReceivedRequests(): StoredConnectionItem[] {
  return getAllConnections().filter((c) => c.status === 'pending' && c.isIncoming);
}

/**
 * Retrieves all accepted connections
 */
export function getAcceptedConnections(): StoredConnectionItem[] {
  return getAllConnections().filter((c) => c.status === 'accepted');
}

/**
 * Send a connection request to a target user
 */
export async function sendConnectionRequest(target: {
  id: string;
  name: string;
  headline?: string;
  avatar?: string;
  role?: string;
  institution?: string;
}): Promise<void> {
  if (typeof window === 'undefined') return;
  ensureInitialized();

  const relatedIds = getRelatedIds(target.id);
  const now = new Date().toISOString();

  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    const ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];

    for (const relId of relatedIds) {
      const item: StoredConnectionItem = {
        targetUserId: relId,
        name: target.name,
        headline: target.headline,
        avatar: target.avatar,
        role: target.role,
        institution: target.institution,
        status: 'pending',
        isIncoming: false,
        updatedAt: now,
      };
      localStorage.setItem(getStorageKey(relId), JSON.stringify(item));
      if (!ids.includes(relId)) {
        ids.push(relId);
      }
    }
    localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
    notifyUpdated();
  } catch (err) {
    console.warn('[connection-store] Write error:', err);
  }

  // Sync to API
  try {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: target.id, action: 'request' }),
    });
  } catch {}
}

/**
 * Revoke an outgoing connection request
 */
export async function revokeConnectionRequest(targetUserId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const relatedIds = getRelatedIds(targetUserId);

  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    let ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];

    for (const relId of relatedIds) {
      const existing = getConnection(relId);
      if (existing) {
        localStorage.setItem(
          getStorageKey(relId),
          JSON.stringify({ ...existing, targetUserId: relId, status: 'none', updatedAt: new Date().toISOString() })
        );
      } else {
        localStorage.removeItem(getStorageKey(relId));
      }
      ids = ids.filter((id) => id !== relId);
    }
    localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
    notifyUpdated();
  } catch (err) {
    console.warn('[connection-store] Revoke error:', err);
  }

  try {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, action: 'withdraw' }),
    });
  } catch {}
}

/**
 * Accept an incoming connection request
 */
export async function acceptConnectionRequest(targetUserId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const relatedIds = getRelatedIds(targetUserId);

  try {
    const existing = getConnection(targetUserId);
    const now = new Date().toISOString();
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    const ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];

    for (const relId of relatedIds) {
      const updated: StoredConnectionItem = {
        targetUserId: relId,
        name: existing?.name || (relId.includes('marcus') || relId === 'user-5' ? 'Marcus Chen' : 'Peer Connection'),
        headline: existing?.headline,
        avatar: existing?.avatar,
        role: existing?.role || 'recruiter',
        institution: existing?.institution,
        status: 'accepted',
        isIncoming: false,
        updatedAt: now,
      };
      localStorage.setItem(getStorageKey(relId), JSON.stringify(updated));
      if (!ids.includes(relId)) {
        ids.push(relId);
      }
    }
    localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
    notifyUpdated();
  } catch (err) {
    console.warn('[connection-store] Accept error:', err);
  }

  try {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, action: 'accept' }),
    });
  } catch {}
}

/**
 * Decline an incoming connection request
 */
export async function declineConnectionRequest(targetUserId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const relatedIds = getRelatedIds(targetUserId);

  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    let ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];

    for (const relId of relatedIds) {
      const existing = getConnection(relId);
      if (existing) {
        localStorage.setItem(
          getStorageKey(relId),
          JSON.stringify({ ...existing, targetUserId: relId, status: 'none', updatedAt: new Date().toISOString() })
        );
      } else {
        localStorage.removeItem(getStorageKey(relId));
      }
      ids = ids.filter((id) => id !== relId);
    }
    localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
    notifyUpdated();
  } catch (err) {
    console.warn('[connection-store] Decline error:', err);
  }

  try {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, action: 'decline' }),
    });
  } catch {}
}

/**
 * Unfollow / disconnect an accepted connection
 */
export async function unfollowConnection(targetUserId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const relatedIds = getRelatedIds(targetUserId);

  try {
    const rawIndex = localStorage.getItem(CONNECTIONS_INDEX_KEY);
    let ids: string[] = rawIndex ? JSON.parse(rawIndex) : [];

    for (const relId of relatedIds) {
      const existing = getConnection(relId);
      if (existing) {
        localStorage.setItem(
          getStorageKey(relId),
          JSON.stringify({ ...existing, targetUserId: relId, status: 'none', updatedAt: new Date().toISOString() })
        );
      } else {
        localStorage.removeItem(getStorageKey(relId));
      }
      ids = ids.filter((id) => id !== relId);
    }
    localStorage.setItem(CONNECTIONS_INDEX_KEY, JSON.stringify(ids));
    notifyUpdated();
  } catch (err) {
    console.warn('[connection-store] Unfollow error:', err);
  }

  try {
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, action: 'withdraw' }),
    });
  } catch {}
}

export const CONNECTIONS_EVENT = EVENT_NAME;
