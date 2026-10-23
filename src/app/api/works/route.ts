import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cacheInvalidatePattern } from '@/lib/redis/cache';
import { checkRateLimit, getRateLimitHeaders, RateLimits } from '@/lib/redis/rate-limit';
import { getClientIp } from '@/lib/utils/ip';

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

const ALLOWED_VISIBILITY = new Set([
  'only_me',
  'connections',
  'campus',
  'public',
  // legacy alias worldwide mapped to public
  'worldwide',
]);

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('works')
      .select('*, owner:profiles(*), skills:work_skills(skills(*))')
      .order('published_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ works: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve works';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Apply Redis sliding-window rate limiting
  const rateLimit = await checkRateLimit(ip, RateLimits.UPLOAD);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before publishing.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit, RateLimits.UPLOAD) }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Strict identity check: Never accept owner_id from request body
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to publish work.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, external_url, storage_path, visibility, skills } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const cleanCategory = category && ALLOWED_CATEGORIES.has(category.toLowerCase())
      ? category.toLowerCase()
      : 'other';

    // Validate external URL if provided: must be https
    let validatedUrl = null;
    if (external_url && typeof external_url === 'string' && external_url.trim().length > 0) {
      try {
        const parsed = new URL(external_url.trim());
        if (parsed.protocol !== 'https:') {
          return NextResponse.json(
            { error: 'External URL must use secure HTTPS protocol' },
            { status: 400 }
          );
        }
        validatedUrl = parsed.toString();
      } catch {
        return NextResponse.json(
          { error: 'Invalid external URL format' },
          { status: 400 }
        );
      }
    }

    const cleanVisibility = visibility && ALLOWED_VISIBILITY.has(visibility)
      ? visibility === 'worldwide' ? 'public' : visibility
      : 'public';

    // Insert work with verified owner_id from session
    const { data: work, error } = await supabase
      .from('works')
      .insert({
        owner_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: cleanCategory,
        external_url: validatedUrl,
        storage_path: storage_path || null,
        visibility: cleanVisibility,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Attach skills if provided
    if (Array.isArray(skills) && skills.length > 0 && work) {
      const workSkills = skills.map((skillId: string) => ({
        work_id: work.id,
        skill_id: skillId,
      }));
      await supabase.from('work_skills').insert(workSkills);
    }

    // Invalidate Redis Showcase feed cache atomically
    await cacheInvalidatePattern('feed:*');

    return NextResponse.json({ success: true, work }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
