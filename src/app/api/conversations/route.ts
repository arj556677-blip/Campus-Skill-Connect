import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // Query conversations where user is a participant
    const { data: convs, error } = await supabase
      .from('conversations')
      .select(`
        id,
        user_one,
        user_two,
        last_message_at,
        created_at
      `)
      .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!convs || convs.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // For each conversation, find the other participant ID
    const otherUserIds = convs.map((c) => (c.user_one === user.id ? c.user_two : c.user_one));

    // Fetch profiles for other participants
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, username, headline, avatar_url, avatar_path')
      .in('id', otherUserIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    // Fetch unread counts and last message text
    const conversationsWithDetails = await Promise.all(
      convs.map(async (c) => {
        const otherId = c.user_one === user.id ? c.user_two : c.user_one;
        const otherProfile = profileMap.get(otherId) || {
          id: otherId,
          display_name: 'Campus Peer',
          username: 'user',
          headline: '',
          avatar_url: null,
          avatar_path: null,
        };

        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', c.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, created_at, sender_id')
          .eq('conversation_id', c.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          id: c.id,
          otherUser: otherProfile,
          lastMessage: lastMsg?.content || 'No messages yet',
          lastMessageAt: lastMsg?.created_at || c.last_message_at || c.created_at,
          unreadCount: unreadCount || 0,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithDetails });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    const body = await request.json();
    const { participantId } = body;

    if (!participantId || typeof participantId !== 'string') {
      return NextResponse.json({ error: 'Valid participantId is required' }, { status: 400 });
    }

    if (participantId === user.id) {
      return NextResponse.json({ error: 'Cannot start conversation with yourself' }, { status: 400 });
    }

    // Check block status
    const { data: isBlocked } = await supabase.rpc('is_blocked', {
      user_a: user.id,
      user_b: participantId,
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Cannot message a blocked user' }, { status: 403 });
    }

    // Enforce accepted connection requirement (Tier 2 requirement: accepted unblocked connections only)
    const { data: areConnected } = await supabase.rpc('are_connected', {
      user_a: user.id,
      user_b: participantId,
    });

    if (!areConnected) {
      return NextResponse.json(
        { error: 'Direct messaging is permitted only between accepted connections.' },
        { status: 403 }
      );
    }

    // Find or create conversation
    const userOne = user.id < participantId ? user.id : participantId;
    const userTwo = user.id < participantId ? participantId : user.id;

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_one', userOne)
      .eq('user_two', userTwo)
      .single();

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        user_one: userOne,
        user_two: userTwo,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ conversation: newConv }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
