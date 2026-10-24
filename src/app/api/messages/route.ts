import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders, RateLimits } from '@/lib/redis/rate-limit';
import { publishChatMessage } from '@/lib/redis/pubsub';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/utils/ip';

const MAX_MESSAGE_LENGTH = 2000;

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId parameter is required' }, { status: 400 });
    }

    // Verify user is a participant in this conversation
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .select('id, user_one, user_two')
      .eq('id', conversationId)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conv.user_one !== user.id && conv.user_two !== user.id) {
      return NextResponse.json({ error: 'Forbidden: you are not a participant in this conversation' }, { status: 403 });
    }

    // Check block status between participants
    const otherUserId = conv.user_one === user.id ? conv.user_two : conv.user_one;
    const { data: isBlocked } = await supabase.rpc('is_blocked', {
      user_a: user.id,
      user_b: otherUserId,
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Cannot view messages with a blocked user' }, { status: 403 });
    }

    // Fetch messages
    const { data: messages, error: msgErr } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, content, is_read, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (msgErr) {
      return NextResponse.json({ error: msgErr.message }, { status: 400 });
    }

    // Mark unread messages sent by the other party as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('is_read', false)
      .neq('sender_id', user.id);

    return NextResponse.json({ messages: messages || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Apply Redis sliding-window rate limit (120 msgs / min)
  const rateLimit = await checkRateLimit(ip, RateLimits.CHAT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before sending more messages.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit, RateLimits.CHAT) }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    // Enforce authentication: identity derived from session
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to send messages.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json({ error: 'Valid conversationId is required' }, { status: 400 });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds maximum allowed limit of ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Persist message to Supabase with authenticated user.id as sender_id
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Broadcast over Redis Pub/Sub broker for low-latency active sockets
    try {
      await publishChatMessage(conversationId, {
        id: message.id,
        senderId: user.id,
        content: message.content,
      });
    } catch (pubSubErr) {
      console.warn('[PubSub] Broadcast failed (message persisted to DB):', pubSubErr);
    }

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
