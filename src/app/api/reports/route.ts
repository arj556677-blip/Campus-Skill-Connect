import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit, RateLimits } from '@/lib/redis/rate-limit';
import { getClientIp } from '@/lib/utils/ip';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: reports, error } = await supabase
      .from('reports')
      .select('id, target_type, target_id, reason, details, status, created_at')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ reports: reports || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(ip, RateLimits.REPORT);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded for reports. Please wait.' },
      { status: 429 }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId, reason, details } = body;

    const allowedTypes = ['profile', 'work', 'message'];
    if (!targetType || !allowedTypes.includes(targetType)) {
      return NextResponse.json(
        { error: `targetType must be one of: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!targetId || typeof targetId !== 'string') {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Reason for report is required' }, { status: 400 });
    }

    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: targetId,
        reason: reason.trim(),
        details: (details || '').trim(),
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Append to audit logs
    try {
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'report_submitted',
        target_resource: `${targetType}:${targetId}`,
        ip_address: ip,
        metadata: { reason: reason.trim() },
      });
    } catch {
      // Audit log failures should not block report submission
    }

    return NextResponse.json(
      { success: true, message: 'Report submitted to moderation queue.', report },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
