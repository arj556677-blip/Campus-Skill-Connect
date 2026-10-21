/* ─────────────────────────────────────────────────────
 * Data Service — Transparent Redis Cache + Supabase + Fallback
 * Implements the Cache-Aside architecture specified in Plan
 * ───────────────────────────────────────────────────── */

import { cacheGet, CacheKeys, CacheTTL } from '../redis/cache';
import { createServerSupabaseClient } from '../supabase/server';
import {
  MOCK_PROFILES,
  MOCK_WORKS,
  MOCK_SKILLS,
  MOCK_COMMUNITIES,
  MOCK_CAMPUSES,
  MOCK_ZONES,
  MOCK_COLLAB_ROOMS,
  MOCK_AUDIT_LOGS,
  MOCK_SUPPORT_TICKETS,
} from './mock-data';
import { Profile, Work, Skill, Community, Campus, Zone, CollaborationRoom, AuditLog, SupportTicket } from '../types';

export async function getWorks(filters?: { category?: string; query?: string }): Promise<Work[]> {
  const filterKey = JSON.stringify(filters || {});
  return cacheGet<Work[]>(
    CacheKeys.showcaseFeed(Buffer.from(filterKey).toString('base64')),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase
          .from('works')
          .select('*, owner:profiles(*), skills:work_skills(skills(*))')
          .order('published_at', { ascending: false });

        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (data && data.length > 0 && !error) {
          return data as Work[];
        }
      } catch (err) {
        // Fallback to mock
      }

      // Filter mock works
      let results = [...MOCK_WORKS];
      if (filters?.category && filters.category !== 'all') {
        results = results.filter((w) => w.category === filters.category);
      }
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(
          (w) =>
            w.title.toLowerCase().includes(q) ||
            (w.description ?? '').toLowerCase().includes(q) ||
            w.skills?.some((s) => s.name.toLowerCase().includes(q))
        );
      }
      return results;
    },
    CacheTTL.DISCOVER_FEED
  );
}

export async function getWorkById(id: string): Promise<Work | null> {
  return cacheGet<Work | null>(
    CacheKeys.work(id),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from('works')
          .select('*, owner:profiles(*), skills:work_skills(skills(*))')
          .eq('id', id)
          .single();

        if (data && !error) return data as Work;
      } catch (err) {
        // Fallback to mock
      }

      return MOCK_WORKS.find((w) => w.id === id) || null;
    },
    CacheTTL.WORK
  );
}

export async function getProfiles(filters?: { role?: string; query?: string; campus?: string }): Promise<Profile[]> {
  return cacheGet<Profile[]>(
    `profiles:all:${JSON.stringify(filters || {})}`,
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase
          .from('profiles')
          .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
          .order('created_at', { ascending: false });

        if (filters?.role) query = query.eq('role', filters.role);
        const { data, error } = await query;
        if (data && data.length > 0 && !error) return data as Profile[];
      } catch (err) {
        // Fallback
      }

      let results = [...MOCK_PROFILES];
      if (filters?.role) results = results.filter((p) => p.role === filters.role);
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(
          (p) =>
            p.display_name.toLowerCase().includes(q) ||
            p.headline?.toLowerCase().includes(q) ||
            p.bio?.toLowerCase().includes(q) ||
            p.field?.toLowerCase().includes(q)
        );
      }
      return results;
    },
    CacheTTL.PROFILE
  );
}

export async function getProfileById(id: string): Promise<Profile | null> {
  return cacheGet<Profile | null>(
    CacheKeys.profile(id),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*, institution:communities(*), campus:campuses(*), zone:zones(*)')
          .eq('id', id)
          .single();

        if (data && !error) return data as Profile;
      } catch (err) {
        // Fallback
      }

      return MOCK_PROFILES.find((p) => p.id === id) || MOCK_PROFILES[0];
    },
    CacheTTL.PROFILE
  );
}

export async function getSkills(): Promise<Skill[]> {
  return cacheGet<Skill[]>(
    CacheKeys.skillsAll(),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from('skills').select('*').order('name');
        if (data && data.length > 0 && !error) return data as Skill[];
      } catch (err) {
        // Fallback
      }
      return MOCK_SKILLS;
    },
    CacheTTL.SKILLS_ALL
  );
}

export async function getCommunities(): Promise<Community[]> {
  return cacheGet<Community[]>(
    CacheKeys.communities(),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from('communities').select('*');
        if (data && data.length > 0 && !error) return data as Community[];
      } catch (err) {
        // Fallback
      }
      return MOCK_COMMUNITIES;
    },
    CacheTTL.COMMUNITIES
  );
}

export async function getZones(): Promise<Zone[]> {
  return cacheGet<Zone[]>(
    CacheKeys.zones(),
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from('zones').select('*');
        if (data && data.length > 0 && !error) return data as Zone[];
      } catch (err) {
        // Fallback
      }
      return MOCK_ZONES;
    },
    CacheTTL.ZONES
  );
}

export async function getCollabRooms(): Promise<CollaborationRoom[]> {
  return cacheGet<CollaborationRoom[]>(
    'rooms:active',
    async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from('collaboration_rooms')
          .select('*, creator:profiles(*)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) return data as CollaborationRoom[];
      } catch (err) {
        // Fallback
      }
      return MOCK_COLLAB_ROOMS;
    },
    60 // 1 minute
  );
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, actor:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data && data.length > 0 && !error) return data as AuditLog[];
  } catch (err) {
    // Fallback
  }
  return MOCK_AUDIT_LOGS;
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: false });
    if (data && data.length > 0 && !error) return data as SupportTicket[];
  } catch (err) {
    // Fallback
  }
  return MOCK_SUPPORT_TICKETS;
}
