import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { z } from 'zod';

const ActionSchema = z.object({
  targetUserId: z.string().uuid(),
  action: z.enum(['request', 'accept', 'decline', 'withdraw', 'block', 'unblock']),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'accepted';

    const supabase = await createServerSupabaseClient();
    
    // Query canonical connections where user is either low or high
    const { data: connections, error } = await supabase
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
      .eq('status', statusFilter)
      .order('updated_at', { ascending: false });

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

    const supabase = await createServerSupabaseClient();

    // 1. Try invoking PostgreSQL canonical transition function
    const { data: rpcResult, error: rpcError } = await supabase.rpc('transition_connection_status', {
      p_other_user_id: targetUserId,
      p_action: action,
      p_actor_id: user.id,
    });

    if (!rpcError && rpcResult) {
      return NextResponse.json({ success: true, result: rpcResult });
    }

    // 2. Direct fallback application-level canonical handling
    const userLow = user.id < targetUserId ? user.id : targetUserId;
    const userHigh = user.id < targetUserId ? targetUserId : user.id;

    if (action === 'block') {
      await supabase.from('blocks').insert({
        blocker_id: user.id,
        blocked_id: targetUserId,
      });

      await supabase
        .from('connections')
        .update({ status: 'blocked', updated_at: new Date().toISOString() })
        .eq('user_low', userLow)
        .eq('user_high', userHigh);

      return NextResponse.json({ success: true, action: 'block' });
    }

    if (action === 'unblock') {
      await supabase
        .from('blocks')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', targetUserId);

      return NextResponse.json({ success: true, action: 'unblock' });
    }

    const { data: existing } = await supabase
      .from('connections')
      .select('*')
      .eq('user_low', userLow)
      .eq('user_high', userHigh)
      .single();

    if (action === 'request') {
      if (existing) {
        if (existing.status === 'pending') {
          return NextResponse.json({ error: 'Connection request already pending' }, { status: 400 });
        }
        if (existing.status === 'accepted') {
          return NextResponse.json({ error: 'Already connected' }, { status: 400 });
        }
        if (existing.status === 'blocked') {
          return NextResponse.json({ error: 'Cannot connect with blocked user' }, { status: 403 });
        }
        const { error: updateErr } = await supabase
          .from('connections')
          .update({
            status: 'pending',
            requested_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from('connections').insert({
          user_low: userLow,
          user_high: userHigh,
          requested_by: user.id,
          status: 'pending',
        });
        if (insertErr) throw insertErr;
      }
    } else if (action === 'accept') {
      if (!existing || existing.status !== 'pending') {
        return NextResponse.json({ error: 'No pending connection request to accept' }, { status: 404 });
      }
      if (existing.requested_by === user.id) {
        return NextResponse.json({ error: 'Cannot accept your own connection request' }, { status: 400 });
      }
      await supabase
        .from('connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else if (action === 'decline') {
      if (!existing || existing.status !== 'pending') {
        return NextResponse.json({ error: 'No pending connection request to decline' }, { status: 404 });
      }
      if (existing.requested_by === user.id) {
        return NextResponse.json({ error: 'Use withdraw to cancel your own request' }, { status: 400 });
      }
      await supabase
        .from('connections')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else if (action === 'withdraw') {
      if (!existing || existing.status !== 'pending') {
        return NextResponse.json({ error: 'No pending connection request to withdraw' }, { status: 404 });
      }
      if (existing.requested_by !== user.id) {
        return NextResponse.json({ error: 'Only requester can withdraw request' }, { status: 403 });
      }
      await supabase
        .from('connections')
        .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    }

    return NextResponse.json({ success: true, action, targetUserId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
