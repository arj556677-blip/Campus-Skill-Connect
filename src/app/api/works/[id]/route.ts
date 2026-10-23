import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { cacheInvalidatePattern } from '@/lib/redis/cache';

const ALLOWED_CATEGORIES = new Set([
  'software',
  'research',
  'certification',
  'art',
  'photography',
  'music',
  'dance',
  'writing',
  'video',
  'other',
]);

const ALLOWED_VISIBILITY = new Set(['only_me', 'connections', 'campus', 'public', 'worldwide']);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: work, error } = await supabase
      .from('works')
      .select('*, owner:profiles(*), skills:work_skills(skills(*))')
      .eq('id', id)
      .single();

    if (error || !work) {
      return NextResponse.json({ error: 'Work item not found' }, { status: 404 });
    }

    return NextResponse.json({ work });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('works')
      .select('id, owner_id')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own work' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = typeof body.description === 'string' ? body.description.trim() : null;
    }

    if (body.category !== undefined) {
      const cat = String(body.category).toLowerCase();
      if (!ALLOWED_CATEGORIES.has(cat)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      updateData.category = cat;
    }

    if (body.visibility !== undefined) {
      const vis = body.visibility === 'worldwide' ? 'public' : body.visibility;
      if (!ALLOWED_VISIBILITY.has(vis)) {
        return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 });
      }
      updateData.visibility = vis;
    }

    if (body.external_url !== undefined) {
      if (body.external_url && typeof body.external_url === 'string' && body.external_url.trim().length > 0) {
        try {
          const parsed = new URL(body.external_url.trim());
          if (parsed.protocol !== 'https:') {
            return NextResponse.json(
              { error: 'External URL must use secure HTTPS protocol' },
              { status: 400 }
            );
          }
          updateData.external_url = parsed.toString();
        } catch {
          return NextResponse.json({ error: 'Invalid external URL format' }, { status: 400 });
        }
      } else {
        updateData.external_url = null;
      }
    }

    if (body.storage_path !== undefined) {
      updateData.storage_path = body.storage_path || null;
    }

    const { data: updatedWork, error: updateErr } = await supabase
      .from('works')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    // Invalidate caches
    await cacheInvalidatePattern('feed:*');

    return NextResponse.json({ success: true, work: updatedWork });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('works')
      .select('id, owner_id')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own work' },
        { status: 403 }
      );
    }

    const { error: deleteErr } = await supabase.from('works').delete().eq('id', id);

    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 400 });
    }

    // Invalidate caches
    await cacheInvalidatePattern('feed:*');

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
