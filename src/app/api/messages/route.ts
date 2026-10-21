import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders, RateLimits } from '@/lib/redis/rate-limit';
import { publishChatMessage } from '@/lib/redis/pubsub';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Apply Redis sliding-window rate limit (120 msgs / min)
  const rateLimit = await checkRateLimit(ip, RateLimits.CHAT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit, RateLimits.CHAT) }
    );
  }

  try {
    const { conversationId, content, senderId } = await request.json();

    if (!content || !conversationId) {
      return NextResponse.json({ error: 'Missing conversationId or content' }, { status: 400 });
    }

    const messageData = {
      id: 'msg-' + Date.now(),
      conversation_id: conversationId,
      sender_id: senderId || 'user-1',
      content,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // 1. Try to persist to Supabase if available
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: senderId || 'user-1',
        content,
      });
    } catch {
      // Fallback
    }

    // 2. Broadcast over Redis Pub/Sub broker
    try {
      await publishChatMessage(conversationId, {
        id: messageData.id,
        senderId: messageData.sender_id,
        content: messageData.content,
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, message: messageData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
