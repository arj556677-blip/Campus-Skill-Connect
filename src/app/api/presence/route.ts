import { NextResponse, type NextRequest } from 'next/server';
import { isOnline, setPresence, removePresence } from '@/lib/redis/session';
import { getUser } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const online = await isOnline(userId);
    return NextResponse.json({
      userId,
      isOnline: online,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message, isOnline: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let userId = body.userId;

    if (!userId) {
      const user = await getUser();
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized or missing userId' }, { status: 400 });
    }

    if (body.action === 'offline') {
      await removePresence(userId);
      return NextResponse.json({ success: true, isOnline: false });
    }

    await setPresence(userId);
    return NextResponse.json({ success: true, isOnline: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
