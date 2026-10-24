import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { userSkillId } = body;

    if (!userSkillId || typeof userSkillId !== 'string') {
      return NextResponse.json({ error: 'Valid userSkillId is required' }, { status: 400 });
    }

    // Look up skill owner
    const { data: userSkill, error: skillErr } = await supabase
      .from('user_skills')
      .select('id, user_id, skill_id')
      .eq('id', userSkillId)
      .single();

    if (skillErr || !userSkill) {
      return NextResponse.json({ error: 'User skill not found' }, { status: 404 });
    }

    if (userSkill.user_id === user.id) {
      return NextResponse.json({ error: 'Cannot endorse your own skills' }, { status: 400 });
    }

    // Enforce accepted connection rule (Tier 2 requirement: endorsements allowed only from accepted connections)
    const { data: areConnected } = await supabase.rpc('are_connected', {
      user_a: user.id,
      user_b: userSkill.user_id,
    });

    if (!areConnected) {
      return NextResponse.json(
        { error: 'Endorsements are permitted only between accepted connections.' },
        { status: 403 }
      );
    }

    // Check block status
    const { data: isBlocked } = await supabase.rpc('is_blocked', {
      user_a: user.id,
      user_b: userSkill.user_id,
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Cannot endorse a blocked user' }, { status: 403 });
    }

    // Insert endorsement (unique constraint enforces 1 per endorser per skill)
    const { data: endorsement, error: insertErr } = await supabase
      .from('skill_endorsements')
      .insert({
        user_skill_id: userSkillId,
        endorser_id: user.id,
      })
      .select()
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') {
        return NextResponse.json({ error: 'You have already endorsed this skill' }, { status: 400 });
      }
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, endorsement }, { status: 201 });
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
    const userSkillId = searchParams.get('userSkillId');

    if (!userSkillId) {
      return NextResponse.json({ error: 'userSkillId parameter is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('skill_endorsements')
      .delete()
      .eq('user_skill_id', userSkillId)
      .eq('endorser_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Endorsement removed' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
