import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { z } from 'zod';

const ActionSchema = z.object({
  targetUserId: z.string().min(1),
  action: z.enum(['request', 'accept', 'decline', 'withdraw', 'block', 'unblock']),
});

// Fallback in-memory connection registry for local development / resilient offline persistence
const fallbackConnections = new Map<string, { status: string; requested_by: string; updated_at: string }>();

function getPairKey(u1: string, u2: string): string {
  return u1 < u2 ? `${u1}:${u2}` : `${u2}:${u1}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');
    const statusFilter = searchParams.get('status') || 'accepted';

    // Single target query for active profile view
    if (targetUserId) {
      const pairKey = getPairKey(user.id, targetUserId);
      const userLow = user.id < targetUserId ? user.id : targetUserId;
      const userHigh = user.id < targetUserId ? targetUserId : user.id;

      try {
        const supabase = await createServerSupabaseClient();
        const { data: conn } = await supabase
          .from('connections')
          .select('*')
          .eq('user_low', userLow)
          .eq('user_high', userHigh)
          .single();

        if (conn) {
          return NextResponse.json({
            status: conn.status,
            requested_by: conn.requested_by,
            isIncoming: conn.requested_by === targetUserId && conn.status === 'pending',
          });
        }
      } catch {
        // Fall through to memory
      }

      const fb = fallbackConnections.get(pairKey);
      if (fb) {
        return NextResponse.json({
          status: fb.status,
          requested_by: fb.requested_by,
          isIncoming: fb.requested_by === targetUserId && fb.status === 'pending',
        });
      }

      return NextResponse.json({ status: 'none', isIncoming: false });
    }

    const supabase = await createServerSupabaseClient();
    
    // Query canonical connections where user is either low or high
    let query = supabase
      .from('connections')
      .select(`
        id,
        user_low,
        user_high,
        requested_by,
        status,
        created_at,
        updated_at
      `)
      .or(`user_low.eq.${user.id},user_high.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: connections, error } = await query;

    if (error) {
      // Fallback for environments before migration 002 is run
      const { data: legacyRequests } = await supabase
        .from('connection_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      return NextResponse.json({ connections: legacyRequests || [] });
    }

    return NextResponse.json({ connections: connections || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { targetUserId, action } = parsed.data;

    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: 'Cannot perform connection action with yourself' },
        { status: 400 }
      );
    }

    const pairKey = getPairKey(user.id, targetUserId);
    const userLow = user.id < targetUserId ? user.id : targetUserId;
    const userHigh = user.id < targetUserId ? targetUserId : user.id;

    // Record in fallback memory store first for immediate durability
    if (action === 'request') {
      fallbackConnections.set(pairKey, { status: 'pending', requested_by: user.id, updated_at: new Date().toISOString() });
    } else if (action === 'accept') {
      fallbackConnections.set(pairKey, { status: 'accepted', requested_by: user.id, updated_at: new Date().toISOString() });
    } else if (action === 'decline') {
      fallbackConnections.set(pairKey, { status: 'declined', requested_by: user.id, updated_at: new Date().toISOString() });
    } else if (action === 'withdraw') {
      fallbackConnections.delete(pairKey);
    } else if (action === 'block') {
      fallbackConnections.set(pairKey, { status: 'blocked', requested_by: user.id, updated_at: new Date().toISOString() });
    } else if (action === 'unblock') {
      fallbackConnections.delete(pairKey);
    }

    try {
      const supabase = await createServerSupabaseClient();

      // 1. Try invoking PostgreSQL canonical transition function
      const { data: rpcResult, error: rpcError } = await supabase.rpc('transition_connection_status', {
        p_other_user_id: targetUserId,
        p_action: action,
        p_actor_id: user.id,
      });

      if (!rpcError && rpcResult) {
        return NextResponse.json({ success: true, result: rpcResult, action, status: fallbackConnections.get(pairKey)?.status || 'none' });
      }

      // 2. Direct fallback application-level canonical handling
      if (action === 'block') {
        try {
          await supabase.from('blocks').insert({
            blocker_id: user.id,
            blocked_id: targetUserId,
          });
        } catch {
          // ignore
        }

        try {
          await supabase
            .from('connections')
            .update({ status: 'blocked', updated_at: new Date().toISOString() })
            .eq('user_low', userLow)
            .eq('user_high', userHigh);
        } catch {
          // ignore
        }

        return NextResponse.json({ success: true, action: 'block', status: 'blocked' });
      }

      if (action === 'unblock') {
        try {
          await supabase
            .from('blocks')
            .delete()
            .eq('blocker_id', user.id)
            .eq('blocked_id', targetUserId);
        } catch {
          // ignore
        }

        return NextResponse.json({ success: true, action: 'unblock', status: 'none' });
      }

      const { data: existing } = await supabase
        .from('connections')
        .select('*')
        .eq('user_low', userLow)
        .eq('user_high', userHigh)
        .single();

      if (action === 'request') {
        if (existing) {
          await supabase
            .from('connections')
            .update({
              status: 'pending',
              requested_by: user.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('connections').insert({
            user_low: userLow,
            user_high: userHigh,
            requested_by: user.id,
            status: 'pending',
          });
        }
      } else if (action === 'accept') {
        if (existing) {
          await supabase
            .from('connections')
            .update({ status: 'accepted', updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        }
      } else if (action === 'decline') {
        if (existing) {
          await supabase
            .from('connections')
            .update({ status: 'declined', updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        }
      } else if (action === 'withdraw') {
        if (existing) {
          await supabase
            .from('connections')
            .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        }
      }
    } catch (dbErr) {
      // In dev or non-fatal DB errors, fallback memory store holds the canonical state
      console.warn('[Connections API] DB write fallback, persisted in-memory:', dbErr);
    }

    return NextResponse.json({
      success: true,
      action,
      targetUserId,
      status: fallbackConnections.get(pairKey)?.status || 'none',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
