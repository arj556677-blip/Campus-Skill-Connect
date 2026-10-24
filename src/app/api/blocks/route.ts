import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/utils/ip';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: blocks, error } = await supabase
      .from('blocks')
      .select(`
        id,
        blocked_id,
        created_at,
        blocked_user:profiles!blocked_id(id, display_name, username, avatar_url)
      `)
      .eq('blocker_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ blocks: blocks || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json({ error: 'Valid targetUserId is required' }, { status: 400 });
    }

    if (targetUserId === user.id) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
    }

    // Insert block (triggers automatic connection cancellation via trg_block_cancels_connection)
    const { data: block, error } = await supabase
      .from('blocks')
      .insert({
        blocker_id: user.id,
        blocked_id: targetUserId,
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore unique conflict if already blocked
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Append to audit logs
    try {
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'user_blocked',
        target_resource: `profile:${targetUserId}`,
        ip_address: ip,
      });
    } catch {
      // Ignore audit fail
    }

    return NextResponse.json({ success: true, message: 'User blocked successfully', block });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId parameter is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', targetUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'User unblocked successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
